class VariantQuickViewSelects extends HTMLElement {
    constructor() {
        super();
        this.item = this.closest('.quickView');
        this.variants = this.getVariantData();

        this.onVariantInit = debounce(() => {
            this.updateOptions();
            this.updateMasterId();
            this.updateMedia(500);
            this.updateVariants(this.variants);
            if (this.checkNeedToConvertCurrency()) {
                let currencyCode = document.getElementById('currencies')?.querySelector('.active')?.getAttribute('data-currency');

                Currency.convertAll(window.shop_currency, currencyCode, 'span.money', 'money_format');
            }
        }, 500);

        this.onVariantInit();
        this.addEventListener('change', this.onVariantChange.bind(this));
    }

    onVariantChange(event) {
        this.updateOptions();
        this.updateMasterId();
        this.updateVariants(this.variants);

        if (!this.currentVariant) {
            this.updateAttribute(true);
        } else {
            this.updateMedia(200);
            this.updateProductInfo();
            this.updateAttribute(false, !this.currentVariant.available);
            this.checkQuantityWhenVariantChange();
        }
    }

    updateVariants(variants){
        const options = Array.from(this.querySelectorAll('.product-form__input'));
        const type = document.getElementById(`product-quick-view-option-${this.dataset.product}`)?.getAttribute('data-type');

        let selectedOption1;
        let selectedOption2;
        let selectedOption3;

        if (variants) {
            if (type == 'button') {
                // console.log(options[0].querySelector('[data-header-option]'));
                if (options[0]) {
                    selectedOption1 = Array.from(options[0].querySelectorAll('input')).find((radio) => radio.checked).value;
                    options[0].querySelector('[data-header-option]').textContent = selectedOption1;
                }

                if (options[1]) {
                    selectedOption2 = Array.from(options[1].querySelectorAll('input')).find((radio) => radio.checked).value;
                    options[1].querySelector('[data-header-option]').textContent = selectedOption2;
                }

                if (options[2]) {
                    selectedOption3 = Array.from(options[2].querySelectorAll('input')).find((radio) => radio.checked).value;
                    options[2].querySelector('[data-header-option]').textContent = selectedOption3;
                }

                var checkVariant = () => {
                    var optionsSize = parseInt(options.length);

                    if(optionsSize > 1){
                        var variantList = variants.filter((variant) => {
                            switch (optionsSize) {
                                case 2: return variant.option2 === selectedOption2;
                                case 3: return variant.option3 === selectedOption3;
                            }
                        });

                        var input1List = options[0].querySelectorAll('.product-form__radio');

                        input1List.forEach((input) => {
                            var label = input.nextSibling;
                            var optionSoldout = Array.from(variantList).find((variant) => {
                                return variant.option1 == input.value && variant.available;
                            });

                            var optionUnavailable = Array.from(variantList).find((variant) => {
                                return variant.option1 == input.value;
                            });

                            if(optionSoldout == undefined){
                                if (optionUnavailable == undefined) {
                                    label.classList.remove('available');
                                    label.classList.remove('soldout');
                                    label.classList.add('unavailable');
                                } else {
                                    label.classList.remove('available');
                                    label.classList.remove('unavailable');
                                    label.classList.add('soldout');
                                }
                            } else {
                                label.classList.remove('soldout');
                                label.classList.remove('unavailable');
                                label.classList.add('available');
                            }
                        });
                    }
                };

                var updateVariant = (optionSoldout, optionUnavailable, element, optionIndex) => {
                    var label = element.nextSibling;

                    if(optionSoldout == undefined){
                        if (optionUnavailable == undefined) {
                            label.classList.remove('available');
                            label.classList.remove('soldout');
                            label.classList.add('unavailable');
                        } else {
                            label.classList.remove('available');
                            label.classList.remove('unavailable');
                            label.classList.add('soldout');
                        }
                    } else {
                        label.classList.remove('soldout');
                        label.classList.remove('unavailable');
                        label.classList.add('available');
                    }
                };

                var renderVariant = (optionIndex, fieldset) => {
                    const inputList = fieldset.querySelectorAll('.product-form__radio');

                    inputList.forEach((input) => {
                        const inputVal = input.value;

                        const optionSoldout = variants.find((variant) => {
                            switch (optionIndex) {
                                case 0: return variant.option1 == inputVal && variant.available;
                                case 1: return variant.option1 == selectedOption1 && variant.option2 == inputVal && variant.available;
                                case 2: return variant.option1 == selectedOption1 && variant.option2 == selectedOption2 && variant.option3 == inputVal && variant.available;
                            }
                        });

                        const optionUnavailable = variants.find((variant) => {
                            switch (optionIndex) {
                                case 0: return variant.option1 == inputVal;
                                case 1: return variant.option1 == selectedOption1 && variant.option2 == inputVal;
                                case 2: return variant.option1 == selectedOption1 && variant.option2 == selectedOption2 && variant.option3 == inputVal;
                            }
                        });

                        updateVariant(optionSoldout, optionUnavailable, input, optionIndex);
                    });
                };
            } else {
                if (options[0]) {
                    selectedOption1 = options[0].querySelector('select').value;
                    options[0].querySelector('[data-header-option]').textContent = selectedOption1;
                }

                if (options[1]) {
                    selectedOption2 = options[1].querySelector('select').value;
                    options[1].querySelector('[data-header-option]').textContent = selectedOption2;
                }

                if (options[2]) {
                    selectedOption3 = options[2].querySelector('select').value;
                    options[2].querySelector('[data-header-option]').textContent = selectedOption3;
                }

                var checkVariant = () => {
                    var optionsSize = parseInt(options.length);

                    if(optionsSize > 1){
                        var variantList = variants.filter((variant) => {
                            switch (optionsSize) {
                                case 2: return variant.option2 === selectedOption2;
                                case 3: return variant.option3 === selectedOption3;
                            }
                        });

                        var option1List = options[0].querySelectorAll('option');

                        option1List.forEach((option) => {
                            var optionSoldout = Array.from(variantList).find((variant) => {
                                return variant.option1 == option.value && variant.available;
                            });

                            var optionUnavailable = Array.from(variantList).find((variant) => {
                                return variant.option1 == option.value;
                            });
                          
                            if(optionSoldout == undefined){
                                if (optionUnavailable == undefined) {
                                    option.classList.remove('available');
                                    option.classList.remove('soldout');
                                    option.classList.add('unavailable');
                                    option.setAttribute('disabled','disabled');
                                } else {
                                    option.classList.remove('available');
                                    option.classList.remove('unavailable');
                                    option.classList.add('soldout');
                                    option.removeAttribute('disabled');
                                }
                            } else {
                                option.classList.remove('soldout');
                                option.classList.remove('unavailable');
                                option.classList.add('available');
                                option.removeAttribute('disabled');
                            }
                        });
                    }
                };

                var updateVariant = (optionSoldout, optionUnavailable, element) => {
                    if(optionSoldout == undefined){
                        if (optionUnavailable == undefined) {
                            element.classList.remove('available');
                            element.classList.remove('soldout');
                            element.classList.add('unavailable');
                            element.setAttribute('disabled','disabled');
                        } else {
                            element.classList.remove('available');
                            element.classList.remove('unavailable');
                            element.classList.add('soldout');
                            element.removeAttribute('disabled');
                        }
                    } else {
                        element.classList.remove('soldout');
                        element.classList.remove('unavailable');
                        element.classList.add('available');
                        element.removeAttribute('disabled');
                    }
                };

                var renderVariant = (optionIndex, select) => {
                    const optionList = select.querySelectorAll('option');

                    optionList.forEach((option) => {
                        const optionVal = option.getAttribute('value');

                        const optionSoldout = variants.find((variant) => {
                            switch (optionIndex) {
                                case 0: return variant.option1 == optionVal && variant.available;
                                case 1: return variant.option1 == selectedOption1 && variant.option2 == optionVal && variant.available;
                                case 2: return variant.option1 == selectedOption1 && variant.option2 == selectedOption2 && variant.option3 == optionVal && variant.available;
                            }
                        });

                        const optionUnavailable = variants.find((variant) => {
                            switch (optionIndex) {
                                case 0: return variant.option1 == optionVal;
                                case 1: return variant.option1 == selectedOption1 && variant.option2 == optionVal;
                                case 2: return variant.option1 == selectedOption1 && variant.option2 == selectedOption2 && variant.option3 == optionVal;
                            }
                        });

                        updateVariant(optionSoldout, optionUnavailable, option);
                    });
                };
            }

            options.forEach((fieldset) => {
                const optionIndex = parseInt(fieldset.getAttribute('data-option-index'));

                renderVariant(optionIndex, fieldset);
                checkVariant();
            });
        }
    }

    updateOptions() {
        this.options = Array.from(this.querySelectorAll('select'), (select) => select.value);
    }

    updateMasterId() {
        this.currentVariant = this.getVariantData().find((variant) => {
            return !variant.options.map((option, index) => {
                return this.options[index] === option;
            }).includes(false);
        });
    }

    updateMedia(time) {
        if (!this.currentVariant || !this.currentVariant?.featured_media) return;

        const newMedia = document.querySelector(
            `[data-media-id="${this.dataset.product}-${this.currentVariant.featured_media.id}"]`
        );

        if (!newMedia) return;

        window.setTimeout(() => {
            $(newMedia).trigger('click');
        }, time);
    }

    updateProductInfo() {
        const fetchPrice = async () => {
            try {
                const res = await fetch(`${this.dataset.url}?variant=${this.currentVariant.id}&view=ajax_product_price`);
                const text = await res.text();
                const html = new DOMParser().parseFromString(text, 'text/html');

                const destination = document.getElementById(`product-quick-view-price-${this.dataset.product}`);
                const source = html.querySelector('body');
                
                if (source && destination) {
                    destination.innerHTML = source.innerHTML;
                }

                if (this.checkNeedToConvertCurrency()) {
                    let currencyCode = document.getElementById('currencies')?.querySelector('.active')?.getAttribute('data-currency');

                    Currency.convertAll(window.shop_currency, currencyCode, 'span.money', 'money_format');
                }

                destination?.classList.remove('visibility-hidden');
            } catch (err) { 
                console.log('Something went wrong to fetch data!')
            }   
        }           

        fetchPrice();
    }

    updateAttribute(unavailable = true, disable = true){
        this.quantityInput = this.item.querySelector('input[name="quantity"]');
        this.inventoryProp = this.item.querySelector('[data-inventory]');
        this.skuProp = this.item.querySelector('[data-sku]');
        this.notifyMe = this.item.querySelector('.productView-notifyMe');
        this.hotStock = this.item.querySelector('.productView-hotStock');
        const addButton = document.getElementById(`product-quick-view-form-${this.dataset.product}`)?.querySelector('[name="add"]');
        const productForms = document.querySelectorAll(`#product-quick-view-form-${this.dataset.product}, #product-quick-view-form-installment-${this.dataset.product}`);

        let quantityInputValue = parseInt(this.quantityInput?.value),
            quantityInputMaxValue,
            alertText = window.inventory_text.max,
            alertMessage = `<div class="alertBox alertBox--error"><p class="alertBox-message">${alertText}</p></div>`;

        if(unavailable){
            let text = window.variantStrings.unavailable;

            this.quantityInput?.setAttribute('disabled', true);

            if(this.notifyMe){
                this.notifyMe.style.display = 'none';
            }

            if(this.hotStock){
                this.hotStock.style.display = 'none';
            }

            addButton.setAttribute('disabled', true);
            addButton.textContent = text;
            this.quantityInput?.closest('quantity-quick-view-input').classList.add('disabled');
        } else {
            if (disable) {
                let text = window.variantStrings.soldOut;

                this.quantityInput?.setAttribute('data-price', this.currentVariant?.price);
                this.quantityInput?.setAttribute('disabled', true);
                addButton.setAttribute('disabled', true);
                addButton.textContent = text;
                this.quantityInput?.closest('quantity-quick-view-input').classList.add('disabled');

                if(this.inventoryProp){
                    this.inventoryProp.querySelector('.productView-info-value').textContent = window.inventory_text.outOfStock;
                }

                if(this.notifyMe){
                    this.notifyMe.querySelector('input[name="halo-notify-product-variant"]').value = this.currentVariant.title;
                    this.notifyMe.querySelector('.notifyMe-text').innerHTML = '';
                    this.notifyMe.style.display = 'block';
                }

                if(this.hotStock){
                    this.hotStock.style.display = 'none';
                }
            } else{
                let text,
                    inventory = this.currentVariant?.inventory_management,
                    arrayInVarName,
                    inven_array,
                    inven_num, 
                    inventoryQuantity;
                
                if(inventory != null) {
                    arrayInVarName = `quick_view_inven_array_${this.dataset.product}`;
                    inven_array = window[arrayInVarName];

                    if(inven_array != undefined) {
                        inven_num = inven_array[this.currentVariant.id];
                        inventoryQuantity = parseInt(inven_num);
                        if (typeof inventoryQuantity != 'undefined'){
                            if(inventoryQuantity > 0) {
                                this.quantityInput?.setAttribute('data-inventory-quantity', inventoryQuantity);
                            } else {
                                this.quantityInput?.removeAttribute('data-inventory-quantity');
                            }
                        } else {
                            this.quantityInput?.setAttribute('data-inventory-quantity', inventoryQuantity);
                        }
                    }
                }
              
                if (typeof inventoryQuantity != 'undefined'){
                    if(inventoryQuantity > 0) {
                        text = window.variantStrings.addToCart;
                    } else  {
                        text = window.variantStrings.preOrder;
                    }
                } else{
                    text = window.variantStrings.addToCart;
                }

                this.quantityInput?.setAttribute('data-price', this.currentVariant?.price);
                this.quantityInput?.removeAttribute('disabled');

                addButton.innerHTML = text;
                addButton.removeAttribute('disabled');
                this.quantityInput?.removeAttribute('disabled');
                this.quantityInput?.closest('quantity-quick-view-input').classList.remove('disabled');
              
                if(window.quick_view_subtotal.show) {
                    let subTotal = 0;
                    let price = this.quantityInput?.dataset.price
                        
                    subTotal = quantityInputValue * price;
                    subTotal = Shopify.formatMoney(subTotal, window.money_format);
                    subTotal = extractContent(subTotal);
                            
                    const moneySpan = document.createElement('span')
                    moneySpan.classList.add(window.currencyFormatted ? 'money' : 'money-subtotal') 
                    moneySpan.innerText = subTotal 
                    document.body.appendChild(moneySpan) 
                    
                    if (this.checkNeedToConvertCurrency()) {
                        let currencyCode = document.getElementById('currencies')?.querySelector('.active')?.getAttribute('data-currency');
                        Currency.convertAll(window.shop_currency, currencyCode, 'span.money', 'money_format');
                    }
        
                    subTotal = moneySpan.innerText 
                    $(moneySpan).remove()
                    const pdView_subTotal = document.querySelector('.quickView .productView-subtotal .money') || document.querySelector('.quickView .productView-subtotal .money-subtotal');
                    pdView_subTotal.innerText = subTotal;
                }

                if(inventoryQuantity > 0) {
                    addButton.classList.remove('button-text-pre-order');
                    quantityInputMaxValue = parseInt(this.quantityInput?.getAttribute('data-inventory-quantity'));

                    if(this.inventoryProp != null){
                        if(inventoryQuantity > 0){
                            const showStock = this.inventoryProp.getAttribute('data-stock-level');
                            if (showStock == 'show') {
                                this.item.querySelector('[data-inventory] .productView-info-value').textContent = inventoryQuantity+' '+window.inventory_text.inStock;
                            }
                            else {
                                this.item.querySelector('[data-inventory] .productView-info-value').textContent = window.inventory_text.inStock;
                            }
                        } else {
                            this.item.querySelector('[data-inventory] .productView-info-value').textContent = window.inventory_text.outOfStock;
                        }
                    }

                    if(this.hotStock){
                        let maxStock = parseInt(this.hotStock.getAttribute('data-hot-stock'));

                        if(0 < inventoryQuantity && inventoryQuantity <= maxStock){
                            let textStock = window.inventory_text.hotStock.replace('[inventory]', inventoryQuantity);

                            this.hotStock.innerHTML = textStock;
                            this.hotStock.style.display = 'block';
                        } else {
                            this.hotStock.innerHTML = '';
                            this.hotStock.style.display = 'none';
                        }
                    }
                } else{
                    addButton.removeAttribute('disabled');
                    addButton.classList.add('button-text-pre-order');

                    if(this.inventoryProp){
                        this.inventoryProp.querySelector('.productView-info-value').textContent = window.inventory_text.inStock;
                    }

                    if(this.hotStock){
                        this.hotStock.style.display = 'none';
                    }
                }

                if(this.notifyMe){
                    this.notifyMe.style.display = 'none';
                }

                if (this.checkNeedToConvertCurrency()) {
                    let currencyCode = document.getElementById('currencies')?.querySelector('.active')?.getAttribute('data-currency');

                    Currency.convertAll(window.shop_currency, currencyCode, 'span.money', 'money_format');
                }
            }
            
            if(this.skuProp && this.currentVariant.sku){
                this.skuProp.querySelector('.productView-info-value').textContent = this.currentVariant.sku;
            }

            productForms.forEach((productForm) => {
                const input = productForm.querySelector('input[name="id"]');

                input.value = this.currentVariant.id;
                input.dispatchEvent(new Event('change', { bubbles: true }));
            });
        }
    }

    getVariantData() {
        this.variantData = this.variantData || JSON.parse(this.getAttribute('data-json'));

        return this.variantData;
    }

    checkNeedToConvertCurrency() {
        return (window.show_multiple_currencies && Currency.currentCurrency != shopCurrency) || window.show_auto_currency;
    }

    checkQuantityWhenVariantChange() {
        var quantityInput = this.closest('.productView-details').querySelector('input.quantity__input')
        var maxValue = parseInt(quantityInput?.dataset.inventoryQuantity);
        var inputValue = parseInt(quantityInput?.value);
        
        let value = inputValue 

        if (inputValue > maxValue && maxValue > 0) {
            value = maxValue
        } else {
            value = inputValue
        }

        if (value < 1 || isNaN(value)) value = 1 

        if (quantityInput != null) quantityInput.value = value

        document.getElementById('product-add-to-cart').dataset.available = this.currentVariant.available && maxValue <= 0
    }
}

customElements.define('variant-quick-view-selects', VariantQuickViewSelects);

class VariantQuickViewRadios extends VariantQuickViewSelects {
    constructor() {
        super();
    }

    updateOptions() {
        const fieldsets = Array.from(this.querySelectorAll('fieldset'));

        this.options = fieldsets.map((fieldset) => {
            return Array.from(fieldset.querySelectorAll('input')).find((radio) => radio.checked).value;
        });
    }
}

customElements.define('variant-quick-view-radios', VariantQuickViewRadios);

class QuantityQuickViewInput extends HTMLElement {
    constructor() {
        super();
        this.input = this.querySelector('input');
        this.changeEvent = new Event('change', { bubbles: true });
        this.input.addEventListener('change', this.onInputChange.bind(this));

        this.querySelectorAll('button').forEach(
            (button) => button.addEventListener('click', this.onButtonClick.bind(this))
        );
    }

    onInputChange(event) {
        event.preventDefault();
        var inputValue = this.input.value;
        var maxValue = parseInt(this.input.dataset.inventoryQuantity);
        var currentId = document.getElementById(`product-quick-view-form-${this.input.dataset.product}`)?.querySelector('[name="id"]')?.value;
        var saleOutStock  = document.getElementById('product-add-to-cart').dataset.available === 'true' || false ;
        const addButton = document.getElementById(`product-quick-view-form-${this.input.dataset.product}`)?.querySelector('[name="add"]');
        
        if(inputValue < 1) {
            inputValue = 1;

            this.input.value =  inputValue;
        }
        
        if (inputValue > maxValue && !saleOutStock && maxValue > 0) {
            var arrayInVarName = `quick_view_selling_array_${this.input.dataset.product}`,
                itemInArray = window[arrayInVarName],
                itemStatus = itemInArray[currentId];
            
            if(itemStatus == 'deny') {
                inputValue = maxValue
                this.input.value =  inputValue;
                const message = getInputMessage(maxValue);
                showWarning(message, 3000);
            }
        } else if (inputValue > maxValue && saleOutStock && maxValue === 0) {
            this.input.value = inputValue;
        } 

        this.input.value =  inputValue;
        document.querySelectorAll('quantity-quick-view-input input[name="quantity"]').forEach(input => {
            if (this.input != input) input.value = inputValue
        })
      
        const mainQty = document.querySelector('.quantity__group--1 .quantity__input');
            mainQty.value = inputValue;

        if(window.quick_view_subtotal.show) {
            var text,
                price = this.input.dataset.price,
                subTotal = 0;

            var parser = new DOMParser();

            subTotal = inputValue * price;
            subTotal = Shopify.formatMoney(subTotal, window.money_format);
            subTotal = extractContent(subTotal);

            const moneySpan = document.createElement('span')
            moneySpan.classList.add(window.currencyFormatted ? 'money' : 'money-subtotal')
            moneySpan.innerText = subTotal 
            document.body.appendChild(moneySpan) 

            if (this.checkNeedToConvertCurrency()) {
                let currencyCode = document.getElementById('currencies')?.querySelector('.active')?.getAttribute('data-currency');
                Currency.convertAll(window.shop_currency, currencyCode, 'span.money', 'money_format');
            }

            subTotal = moneySpan.innerText 
            $(moneySpan).remove()
            const pdView_subTotal = document.querySelector('.quickView .productView-subtotal .money') || document.querySelector('.quickView .productView-subtotal .money-subtotal');
            pdView_subTotal.innerText = subTotal;
        }   
    }

    onButtonClick(event) {
        event.preventDefault();
        const previousValue = this.input.value;

        event.target.name === 'plus' ? this.input.stepUp() : this.input.stepDown();
        if (previousValue !== this.input.value) this.input.dispatchEvent(this.changeEvent);
    }

    checkNeedToConvertCurrency() {
        return (window.show_multiple_currencies && Currency.currentCurrency != shopCurrency) || window.show_auto_currency;
    }
}

customElements.define('quantity-quick-view-input', QuantityQuickViewInput);

function showWarning(content, time = null) {
    if (window.warningTimeout) {
        clearTimeout(window.warningTimeout);
    }
    const warningPopupContent = document.getElementById('halo-warning-popup').querySelector('[data-halo-warning-content]')
    warningPopupContent.textContent = content
    document.body.classList.add('has-warning')

    if (time) {
        window.warningTimeout = setTimeout(() => {
            document.body.classList.remove('has-warning')
        }, time)
    }
}

function getInputMessage(maxValue) {
    var message = window.cartStrings.addProductOutQuantity.replace('[maxQuantity]', maxValue);
    return message
}