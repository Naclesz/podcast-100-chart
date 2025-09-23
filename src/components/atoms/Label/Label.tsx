import "./Label.scss";

type LabelProps = {
  children: React.ReactNode;
};

export default function Label({ children }: LabelProps): React.ReactNode {
  return <label className="label">{children}</label>;
}
