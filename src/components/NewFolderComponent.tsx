import { faPlus, faSpinner } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { folderIconStyle, folderStyle } from "./FolderComponent";
import { useRouter } from "next/navigation";
import { useState } from "react";
import newFolder from "@/api/newFolder";

export default function NewFolder() {
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();
    const handleOnClick = () => {
        setIsLoading(true);
        setTimeout(() => newFolder().then(id => router.push("/edit?id=" + id)), 1000)
    };

    return <div style={folderStyle} onClick={handleOnClick}>
        {
            (isLoading) ?
                // @ts-ignore
                <FontAwesomeIcon icon={faSpinner} flip style={{color: "#fcba03", ...folderIconStyle}}/> : 
                <FontAwesomeIcon icon={faPlus} className={"folderIcon"} style={{color: "#fcba03", ...folderIconStyle}}/>
        }
    </div>;
}