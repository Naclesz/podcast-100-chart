import { useAppContext } from "context/AppContext";
import { useNavigate } from "react-router";

type UseNavigationProps = {
  navigateTo: (path: string) => void;
};

export const useNavigation = (): UseNavigationProps => {
  const navigate = useNavigate();
  const { setIsNavigating } = useAppContext();

  function navigateTo(path: string): void {
    navigate(path);
    setIsNavigating(true);
  }

  return {
    navigateTo,
  };
};
