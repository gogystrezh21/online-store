import { RangeModelView } from '../../model/model';
import './range-slider.css';

export class RangeSlider {
    private _fromSlider: HTMLInputElement;
    private _toSlider: HTMLInputElement;
    private _sliderColor = '#C0B9C7';
    private _rangeColor = '#6F6777';
    private _formValueMin: HTMLDivElement;
    private _formValueMax: HTMLDivElement;
    private _modelView: RangeModelView;

    constructor(modelView: RangeModelView) {
        this._modelView = modelView;
    }

    controlFromSlider() {
        const from = Number(this._fromSlider.value);
        const to = Number(this._toSlider.value);

        if (from > to) {
            this._fromSlider.value = to.toString();
        }
        this._modelView.low = Number(this._fromSlider.value);
        this._formValueMin.textContent = `Min: ${this._fromSlider.value}`;

        this.fillSlider();
    }

    controlToSlider() {
        const from = Number(this._fromSlider.value);
        const to = Number(this._toSlider.value);

        if (from <= to) {
            this._toSlider.value = to.toString();
        } else {
            this._toSlider.value = from.toString();
        }
        this._modelView.high = Number(this._toSlider.value);
        this._formValueMax.textContent = `Max: ${this._toSlider.value}`;
        this.fillSlider();
    }

    fillSlider(): void {
        const from = Number(this._fromSlider.value);
        const to = Number(this._toSlider.value);
        const toMin = Number(this._toSlider.min);
        const toMax = Number(this._toSlider.max);

        const rangeDistance = toMax - toMin;
        const fromPosition = from - toMin;
        const toPosition = to - toMin;
        this._toSlider.style.background = `linear-gradient(
          to right,
          ${this._sliderColor} 0%,
          ${this._sliderColor} ${(fromPosition / rangeDistance) * 100}%,
          ${this._rangeColor} ${(fromPosition / rangeDistance) * 100}%,
          ${this._rangeColor} ${(toPosition / rangeDistance) * 100}%,
          ${this._sliderColor} ${(toPosition / rangeDistance) * 100}%,
          ${this._sliderColor} 100%)`;
    }

    render() {
        const rangeContainer = document.createElement('div') as HTMLDivElement;
        rangeContainer.className = 'range-container';
        const slidersControl = document.createElement('div') as HTMLDivElement;
        slidersControl.className = 'sliders-control';

        this._fromSlider = document.createElement('input') as HTMLInputElement;
        this._fromSlider.id = 'fromSlider';
        this._fromSlider.type = 'range';
        this._fromSlider.addEventListener('input', this.controlFromSlider.bind(this));

        this._toSlider = document.createElement('input') as HTMLInputElement;
        this._toSlider.id = 'toSlider';
        this._toSlider.type = 'range';
        this._toSlider.addEventListener('input', this.controlToSlider.bind(this));

        const formValues = document.createElement('div') as HTMLDivElement;
        formValues.className = 'form-values';

        this._formValueMin = document.createElement('div') as HTMLDivElement;
        this._formValueMax = document.createElement('div') as HTMLDivElement;

        rangeContainer.append(slidersControl, formValues);
        slidersControl.append(this._fromSlider, this._toSlider);
        formValues.append(this._formValueMin, this._formValueMax);

        this.updateFromSlider();
        this.updateToSlider();
        this.fillSlider();

        return rangeContainer;
    }

    updateFromSlider() {
        this._fromSlider.min = `${this._modelView.range.min}`;
        this._fromSlider.max = `${this._modelView.range.max}`;
        this._fromSlider.value = `${this._modelView.low}`;
        this._formValueMin.textContent = `Min: ${this._fromSlider.value}`;
    }

    updateToSlider() {
        this._toSlider.min = `${this._modelView.range.min}`;
        this._toSlider.max = `${this._modelView.range.max}`;
        this._toSlider.value = `${this._modelView.high}`;
        this._formValueMax.textContent = `Max: ${this._toSlider.value}`;
    }

    public rerender(): void {
        this.updateFromSlider();
        this.updateToSlider();
        this.fillSlider();
    }
}
