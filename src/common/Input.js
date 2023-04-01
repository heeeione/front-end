import './Input.css';

export default function Input(props) {
  const inputItem = props.inputItem;
  return (
    <div className="input-block">
      <input
        className={'input ' + props.className}
        key={inputItem.name}
        type={inputItem.type}
        name={inputItem.name}
        required={inputItem.required}
        pattern={inputItem.pattern}
        maxLength={inputItem.maxLength}
        title={inputItem.title}
        autoComplete="off"
      ></input>
      <span className="name">
        {inputItem.name}
        <span className="required-mark">{inputItem.required ? '*' : ''}</span>
      </span>
    </div>
  );
}
