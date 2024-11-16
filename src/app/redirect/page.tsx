import { permanentRedirect, redirect } from "next/navigation";

const page = async ({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) => {
  const search = await searchParams;
  if (search.redirect) {
    const url = decodeURI(search.redirect as string);
    redirect(url);
  }
  permanentRedirect("/app/");
};

export default page;
