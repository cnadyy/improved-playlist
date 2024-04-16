import { useSearchParams } from "next/navigation";

export default function useParamId() {
    const searchParams = useSearchParams();
    return searchParams.get("id");
}
