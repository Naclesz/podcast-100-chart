import "./Input.scss";

type InputProps = {
  placeholder: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
} & React.InputHTMLAttributes<HTMLInputElement>;

export default function Input({
  placeholder,
  onChange,
  ...props
}: InputProps): React.ReactNode {
  return (
    <input
      className="input"
      placeholder={placeholder}
      onChange={(event) => {
        onChange(event);
      }}
      {...props}
    />
  );
}
