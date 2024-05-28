import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { Helmet } from "react-helmet-async";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { imageUpload } from "../../../api/utils";
import AddRoomForm from "../../../components/Form/AddRoomForm";
import useAuth from "../../../hooks/useAuth";
import { axiosSecure } from "../../../hooks/useAxiosCommon";

const AddRoom = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const [imagePreview, setImagePreview] = useState();
  //   console.log(imagePreview);
  const [imageText, setImageText] = useState("Upload Image");
  const [dates, setDates] = useState({
    startDate: new Date(),
    endDate: new Date(),
    key: "selection",
  });

  // date range handler
  const handleDates = (item) => {
    console.log(item);
    setDates(item.selection);
  };

  const { mutateAsync } = useMutation({
    mutationFn: async (roomData) => {
      const { data } = await axiosSecure.post("/room", roomData);
      return data;
    },
    onSuccess: () => {
      toast.success("Room added successfully");
      navigate("/dashboard/my-listings");
      setLoading(false);
    },
  });

  // Form handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const form = e.target;
    const location = form.location.value;
    const category = form.category.value;
    const title = form.title.value;
    const to = dates.endDate;
    const from = dates.startDate;
    const description = form.description.value;
    const price = form.price.value;
    const guests = form.total_guest.value;
    const bedrooms = form.bedrooms.value;
    const bathrooms = form.bathrooms.value;
    // upload image
    const image = form.image.files[0];
    // যে হোস্ট সেই শুধু রুম অ্যাড করতে পারবে, এখানে সেই হোস্ট এর ডাটা থাকবে
    const host = {
      name: user?.displayName,
      image: user?.photoURL,
      email: user?.email,
    };
    try {
      // upload image and get image url
      const image_url = await imageUpload(image);
      console.log(image_url);

      const roomData = {
        location,
        category,
        title,
        to,
        from,
        description,
        price,
        guests,
        bedrooms,
        bathrooms,
        image: image_url,
        dates,
        host,
      };
      console.table(roomData);
      // post request to server to add room
      await mutateAsync(roomData);
    } catch (error) {
      console.log(error);
      toast.error("Failed to add room");
      setLoading(false);
    }
  };

  // handle image change
  const handleImage = (image) => {
    setImagePreview(URL.createObjectURL(image));
    setImageText(image.name);
  };
  return (
    <>
      <Helmet>
        <title>Add Room | Dashboard </title>
      </Helmet>
      {/* Form */}
      <AddRoomForm
        dates={dates}
        handleDates={handleDates}
        handleSubmit={handleSubmit}
        setImagePreview={setImagePreview}
        imagePreview={imagePreview}
        handleImage={handleImage}
        imageText={imageText}
        loading={loading}
      />
    </>
  );
};

export default AddRoom;
