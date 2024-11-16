import { permanentRedirect } from "next/navigation";

const page = () => {
  permanentRedirect("/app/");
};

export default page;
