import { useLocation } from "@reach/router";
import { MODAL_KEYS } from "@/constants/modal-keys";

export const extract_hash_value = (params: {
  hash: string;
  key: keyof typeof MODAL_KEYS;
}) => {
  const hashes = params.hash.replace("#", "").split("&");
  const get_actual_hash = hashes.find((hash) => hash.includes(params.key));
  const value = get_actual_hash?.split("=")[1] || null;

  return value;
};

export const useModal = (key: keyof typeof MODAL_KEYS) => {
  const location = useLocation();

  const isOpen = location?.hash.includes(MODAL_KEYS[key]);
  const value = extract_hash_value({
    hash: location?.hash,
    key,
  });

  return { isOpen, value };
};
