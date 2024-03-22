import { faPlus, faSpinner } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRouter } from "next/navigation";
import { CSSProperties, useState } from "react";
import newFolder from "@/api/newFolder";

export default function NewFolder({ style }: { style: CSSProperties }) {
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
    <div onClick={handleOnClick} style={{
      borderRadius: "20px",
      padding: "0 2rem",
      backgroundColor: "#ffd76b87",
      ...style
    }}>
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
          style={{
            color: "#fcba03", 
            height: "100%",
          }}
        />
      )}
    </div>
  );
}
