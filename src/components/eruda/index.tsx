import { LoaderCircle } from "lucide-react";
import { ReactNode, Suspense, lazy } from "react";

const Eruda = lazy(() =>
  import("./eruda-provider").then((c) => ({ default: c.Eruda })),
);

export const ErudaProvider = (props: { children: ReactNode }) => {
  if (process.env.PROD) {
    return props.children;
  }

  return (
    <Suspense
      fallback={
        <div className="flex h-full w-full items-center justify-center">
          <div className="flex h-40 w-40 items-center justify-center">
            <LoaderCircle className="stroke-white-600 h-10 w-10 animate-spin" />
          </div>
        </div>
      }
    >
      <Eruda>{props.children}</Eruda>
    </Suspense>
  );
};
