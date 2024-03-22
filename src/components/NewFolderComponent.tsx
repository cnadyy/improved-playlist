import { faPlus, faSpinner } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRouter } from "next/navigation";
import { useState } from "react";
import newFolder from "@/api/newFolder";

export default function NewFolder() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const handleOnClick = () => {
    setIsLoading(true);
    setTimeout(
      () => newFolder().then((id) => router.push("/edit?id=" + id)),
      1000,
    );
  };

  return (
    <div onClick={handleOnClick}>
      {isLoading ? (
        <FontAwesomeIcon
          icon={faSpinner}
          // @ts-expect-error flip=true is valid but not typed
          flip
          style={{ color: "#fcba03", height: "100%" }}
        />
      ) : (
        <FontAwesomeIcon
          icon={faPlus}
          style={{ color: "#fcba03", height: "100%" }}
        />
      )}
    </div>
  );
}
