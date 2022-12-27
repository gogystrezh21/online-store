import { RangeModelView } from '../../model/model';
import './double-slider.css';

export class DoubleSlider {
    private fromSlider: HTMLInputElement;
    private toSlider: HTMLInputElement;
    private sliderColor = '#C6C6C6';
    private rangeColor = '#25daa5';
    private formValueMin: HTMLDivElement;
    private formValueMax: HTMLDivElement;
    private modelView: RangeModelView;

    constructor(modelView: RangeModelView) {
        this.modelView = modelView;
    }

    controlFromSlider() {
        const from = Number(this.fromSlider.value);
        const to = Number(this.toSlider.value);

        if (from > to) {
            this.fromSlider.value = to.toString();
        }
        this.modelView.low = Number(this.fromSlider.value);
        this.formValueMin.textContent = `Min: ${this.fromSlider.value}`;

        this.fillSlider();
    }

    controlToSlider() {
        const from = Number(this.fromSlider.value);
        const to = Number(this.toSlider.value);

        if (from <= to) {
            this.toSlider.value = to.toString();
        } else {
            this.toSlider.value = from.toString();
        }
        this.modelView.high = Number(this.toSlider.value);
        this.formValueMax.textContent = `Max: ${this.toSlider.value}`;
        this.fillSlider();
    }

    fillSlider(): void {
        const from = Number(this.fromSlider.value);
        const to = Number(this.toSlider.value);
        const toMin = Number(this.toSlider.min);
        const toMax = Number(this.toSlider.max);

        const rangeDistance = toMax - toMin;
        const fromPosition = from - toMin;
        const toPosition = to - toMin;
        this.toSlider.style.background = `linear-gradient(
          to right,
          ${this.sliderColor} 0%,
          ${this.sliderColor} ${(fromPosition / rangeDistance) * 100}%,
          ${this.rangeColor} ${(fromPosition / rangeDistance) * 100}%,
          ${this.rangeColor} ${(toPosition / rangeDistance) * 100}%,
          ${this.sliderColor} ${(toPosition / rangeDistance) * 100}%,
          ${this.sliderColor} 100%)`;
    }

    render() {
        const rangeContainer = document.createElement('div') as HTMLDivElement;
        rangeContainer.className = 'range-container';
        const slidersControl = document.createElement('div') as HTMLDivElement;
        slidersControl.className = 'sliders-control';

        this.fromSlider = document.createElement('input') as HTMLInputElement;
        this.fromSlider.id = 'fromSlider';
        this.fromSlider.type = 'range';
        this.fromSlider.addEventListener('input', this.controlFromSlider.bind(this));

        this.toSlider = document.createElement('input') as HTMLInputElement;
        this.toSlider.id = 'toSlider';
        this.toSlider.type = 'range';
        this.toSlider.addEventListener('input', this.controlToSlider.bind(this));

        const formValues = document.createElement('div') as HTMLDivElement;
        formValues.className = 'form-values';

        this.formValueMin = document.createElement('div') as HTMLDivElement;
        this.formValueMax = document.createElement('div') as HTMLDivElement;

        rangeContainer.append(slidersControl, formValues);
        slidersControl.append(this.fromSlider, this.toSlider);
        formValues.append(this.formValueMin, this.formValueMax);

        this.updateFromSlider();
        this.updateToSlider();
        this.fillSlider();

        return rangeContainer;
    }

    updateFromSlider() {
        this.fromSlider.min = `${this.modelView.range.min}`;
        this.fromSlider.max = `${this.modelView.range.max}`;
        this.fromSlider.value = `${this.modelView.low}`;
        this.formValueMin.textContent = `Min: ${this.fromSlider.value}`;
    }

    updateToSlider() {
        this.toSlider.min = `${this.modelView.range.min}`;
        this.toSlider.max = `${this.modelView.range.max}`;
        this.toSlider.value = `${this.modelView.high}`;
        this.formValueMax.textContent = `Max: ${this.toSlider.value}`;
    }

    public rerender(): void {
        this.updateFromSlider();
        this.updateToSlider();
        this.fillSlider();
    }
}
