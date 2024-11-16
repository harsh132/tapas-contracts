import { permanentRedirect, redirect } from "next/navigation";

const page = async ({
  params,
  searchParams,
}: {
  params: Promise<Record<string, string>>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) => {
  const search = await searchParams;
  if (search.redirect) {
    const url = decodeURI(search.redirect as string);
    redirect(url);
  }
  permanentRedirect("/app/");
};

export default page;
