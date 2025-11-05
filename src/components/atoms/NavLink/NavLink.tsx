import { useNavigationContext } from "context/NavigationContext";
import type { LinkProps } from "react-router";
import { Link } from "react-router";

export default function NavLink(props: LinkProps): React.ReactElement {
  const { startNavigation } = useNavigationContext();

  function handleClick(
    event: React.MouseEvent<HTMLAnchorElement, MouseEvent>
  ): void {
    if (
      event.button === 0 &&
      !event.ctrlKey &&
      !event.metaKey &&
      !event.shiftKey &&
      !event.altKey
    ) {
      startNavigation();
    }

    if (props.onClick) {
      props.onClick(event);
    }
  }

  return <Link {...props} onClick={handleClick} />;
}
