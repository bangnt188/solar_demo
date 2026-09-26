type RangeInputProps = {
  id: string;
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (value: number) => void;
  formatValue: (value: number) => string;
};

export function RangeInput({ id, label, value, min, max, step, onChange, formatValue }: RangeInputProps) {
  return (
    <div className="range-field">
      <label className="calculator-label" htmlFor={id}>{label}<output htmlFor={id}>{formatValue(value)}</output></label>
      <input id={id} className="calculator-slider" type="range" min={min} max={max} step={step} value={value} onChange={(event) => onChange(Number(event.currentTarget.value))} />
      <div className="calculator-range" aria-hidden="true"><span>{formatValue(min)}</span><span>{formatValue(max)}</span></div>
    </div>
  );
}
