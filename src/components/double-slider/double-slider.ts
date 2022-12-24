import { Model } from '../../model/model';
import './double-slider.css';

export class DoubleSlider {
    private fromSlider: HTMLInputElement;
    private toSlider: HTMLInputElement;
    private sliderColor = '#C6C6C6';
    private rangeColor = '#25daa5';
    private formValueMin: HTMLDivElement;
    private formValueMax: HTMLDivElement;
    private model: Model;

    constructor(model: Model) {
        this.model = model;
    }

    controlFromSlider() {
        const from = Number(this.fromSlider.value);
        const to = Number(this.toSlider.value);

        if (from > to) {
            this.fromSlider.value = to.toString();
        }
        this.formValueMax.textContent = `Min: ${this.fromSlider.value}`;

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
        this.formValueMin.textContent = `Max: ${this.toSlider.value}`;
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

        const fromSlider = document.createElement('input') as HTMLInputElement;
        fromSlider.id = 'fromSlider';
        fromSlider.type = 'range';
        fromSlider.min = `${this.model.data?.price.min}`;
        fromSlider.max = `${this.model.data?.price.max}`;
        fromSlider.value = `${this.model.data?.price.min}`;
        fromSlider.addEventListener('input', this.controlFromSlider.bind(this));
        this.fromSlider = fromSlider;

        const toSlider = document.createElement('input') as HTMLInputElement;
        toSlider.id = 'toSlider';
        toSlider.type = 'range';
        toSlider.min = `${this.model.data?.price.min}`;
        toSlider.max = `${this.model.data?.price.max}`;
        toSlider.value = `${this.model.data?.price.max}`;
        toSlider.addEventListener('input', this.controlToSlider.bind(this));
        this.toSlider = toSlider;

        const formValues = document.createElement('div') as HTMLDivElement;
        formValues.className = 'form-values';

        this.formValueMin = document.createElement('div') as HTMLDivElement;
        this.formValueMin.textContent = `Min: ${fromSlider.value}`;
        this.formValueMax = document.createElement('div') as HTMLDivElement;
        this.formValueMax.textContent = `Max: ${toSlider.value}`;

        rangeContainer.append(slidersControl, formValues);
        slidersControl.append(fromSlider, toSlider);
        formValues.append(this.formValueMin, this.formValueMax);

        this.fillSlider();

        return rangeContainer;
    }
}
