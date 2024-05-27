import { useState } from "react";
import { imageUpload } from "../../../api/utils";
import AddRoomForm from "../../../components/Form/AddRoomForm";
import useAuth from "../../../hooks/useAuth";

const AddRoom = () => {
  const { user } = useAuth();
  const [imagePreview, setImagePreview] = useState();
  //   console.log(imagePreview);
  const [imageText, setImageText] = useState("Upload Image");
  const [dates, setDates] = useState({
    startDate: new Date(),
    endDate: null,
    key: "selection",
  });

  // date range handler
  const handleDates = (item) => {
    console.log(item);
    setDates(item.selection);
  };

  // Form handler
  const handleSubmit = async (e) => {
    e.preventDefault();
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
    } catch (error) {
      console.log(error);
    }
  };

  // handle image change
  const handleImage = (image) => {
    setImagePreview(URL.createObjectURL(image));
    setImageText(image.name);
  };
  return (
    <div>
      {/* Form */}
      <AddRoomForm
        dates={dates}
        handleDates={handleDates}
        handleSubmit={handleSubmit}
        setImagePreview={setImagePreview}
        imagePreview={imagePreview}
        handleImage={handleImage}
        imageText={imageText}
      />
    </div>
  );
};

export default AddRoom;
