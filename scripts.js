class Refund {

    static processOnLoading() {
        this.handleEvents();
    }

    static handleEvents() {
        this.handleEventsInputAmount();
        this.handleEventsForm();
        this.handleEventsList();
    }

    static handleEventsInputAmount() {
        this.onInputAmount();
    }

    static onInputAmount() {
        this.getInputAmount().addEventListener('input', () => {
            const sValueWithoutLetters = (this.getValueAmount()).replace(/\D/g, '');
            this.setValueAmount(this.formatLocalCurrency(sValueWithoutLetters));
        });
    }

    static handleEventsForm() {
        this.onSubmitForm();
    }

    static onSubmitForm() {
        this.getFormElement().addEventListener('submit', (oEvent) => {
            oEvent.preventDefault();
            this.addExpense(this.getDataObjectExpense());
        });
    }

    static getDataObjectExpense() {
        return {
            iId           : new Date().getTime(),
            sExpense      : this.getValueExpense(),
            sCategoryId   : this.getValueCategory(),
            sCategoryName : this.getNameOfSelectedValueCategory(),
            sAmount       : this.getValueAmount(),
            dCreatedAt    : new Date()
        };
    }

    static addExpense(oExpense) {
        try {
            this.createItemList(oExpense);
            this.updateTotals();
            this.resetForm();
        }
        catch (Error) {
            this.showAlert('Não foi possível atualizar a lista de despesas.');
            console.log(Error);
        }
    }

    static createItemList(oExpense) {
        const oItem = document.createElement('li');
        oItem.classList.add('expense');
        
        oItem.append(
            this.createIconItem(oExpense),
            this.createInfoItem(oExpense),
            this.createAmountItem(oExpense),
            this.createRemoveIconItem()
        );
        
        this.getUnorderedListElement().append(oItem);
    }

    static createIconItem(oExpense) {
        const oIcon = document.createElement('img');
        oIcon.setAttribute('src', `img/${oExpense.sCategoryId}.svg`);
        oIcon.setAttribute('alt', oExpense.sCategoryName);
        return oIcon;
    }

    static createInfoItem(oExpense) {
        const oInfo = document.createElement('div');
        oInfo.classList.add('expense-info');

        const oName = document.createElement('strong');
        oName.textContent = oExpense.sExpense;

        const oCategory = document.createElement('span');
        oCategory.textContent = oExpense.sCategoryName;

        oInfo.append(oName, oCategory);

        return oInfo;
    }
    
    static createAmountItem(oExpense) {
        const oAmount = document.createElement('span');
        oAmount.classList.add('expense-amount');
        oAmount.innerHTML = `<small>R$</small>${this.removeRealCurrencySymbol(oExpense.sAmount)}`;
        return oAmount;
    }

    static createRemoveIconItem() {
        const oRemoveIcon = document.createElement('img');
        oRemoveIcon.classList.add('remove-icon');
        oRemoveIcon.setAttribute('src', 'img/remove.svg');
        oRemoveIcon.setAttribute('alt', 'Remover');
        return oRemoveIcon;
    }

    static updateTotals() {
        try {
            this.updateExpenseQuantity();
            this.updateExpenseValue();
        }
        catch (Error) {
            console.log(Error);
            this.showAlert('Não foi possível atualizar o total de itens.');
        }
    }

    static updateExpenseQuantity() {
        const iQuantityItems = this.getQuantityListItems();
        this.setContentExpenseQuantityElement(this.handleExpenseQuantityValue(iQuantityItems));
    }

    static updateExpenseValue() {
        let iTotal = 0;

        const aItems = this.getListItemsElement();

        for(let iItem = 0; iItem < this.getQuantityListItems(); iItem++) {
            const oItem = aItems[iItem].querySelector('.expense-amount');
            iTotal += Number(this.getExpenseAmountItem(oItem));
        }

        this.handleTotalElement(iTotal);
    }

    static getExpenseAmountItem(oItem) {
        const iValue = parseFloat(oItem.textContent.replace(/[^\d]/g, '').replace(',', '.'));

        if(isNaN(iValue)) {
            throw new Error('Não foi possível calcular o total. Somente valores numéricos devem ser somados.');
        }

        return iValue;
    }
    
    static handleTotalElement(iTotal) {
        const sProcessedTotal = this.removeRealCurrencySymbol(this.formatLocalCurrency(iTotal));

        this.setContentTotalElement();

        this.getTotalElement().append(
            this.createRealCurrencySymbol(),
            sProcessedTotal
        );
    }

    static createRealCurrencySymbol() {
        const oSymbol = document.createElement('small');
        oSymbol.textContent = 'R$';
        return oSymbol;
    }

    static handleEventsList() {
        this.onClickRemoveIcon();
    }

    static onClickRemoveIcon() {
        this.getUnorderedListElement().addEventListener('click', (oEvent) => {
            if(oEvent.target.classList.contains('remove-icon')) {
                const oItem = oEvent.target.closest('.expense');
                oItem.remove();
            }

            this.updateTotals();
        });
    }
    
    static getFormElement() {
        return document.querySelector('form');
    }

    static getUnorderedListElement() {
        return document.querySelector('ul');
    }

    static getListItemsElement() {
        return this.getUnorderedListElement().children;
    }

    static getQuantityListItems() {
        return this.getListItemsElement().length;
    }

    static getExpenseQuantityElement() {
        return document.querySelector('aside header p span');
    }

    static setContentExpenseQuantityElement(sValue) {
        this.getExpenseQuantityElement().textContent = sValue;
    }

    static getTotalElement() {
        return document.querySelector('aside header h2');
    }

    static setContentTotalElement(sValue) {
        this.getTotalElement().textContent = sValue;
    }

    static getInputAmount() {
        return document.querySelector('#amount');
    }

    static getValueAmount() {
        return this.getInputAmount().value;
    }

    static setValueAmount(sValue) {
        this.getInputAmount().value = sValue;
    }

    static getInputExpense() {
        return document.querySelector('#expense');
    }

    static getValueExpense() {
        return this.getInputExpense().value;
    }

    static setValueExpense(sValue) {
        this.getInputExpense().value = sValue;
    }

    static getInputCategory() {
        return document.querySelector('#category');
    }

    static getValueCategory() {
        return this.getInputCategory().value;
    }

    static getNameOfSelectedValueCategory() {
        return this.getInputCategory().options[this.getInputCategory().selectedIndex].text;
    }

    static setValueCategory(sValue) {
        this.getInputCategory().value = sValue;
    }

    static handleExpenseQuantityValue(iItemsQuantity) {
        return `${iItemsQuantity} ${iItemsQuantity > 1 ? 'despesas' : 'despesa'}`;
    }

    static formatLocalCurrency(sValue) {
        const iValueInCents = Number(sValue) / 100;

        return iValueInCents.toLocaleString('pt-BR', {
            style    : 'currency',
            currency : 'BRL'
        });
    }

    static removeRealCurrencySymbol(sAmount) {
        return sAmount.toUpperCase().replace('R$', '');
    }

    static resetForm() {
        this.setValueExpense('');
        this.setValueCategory('');
        this.setValueAmount('');
        this.getInputExpense().focus();
    }

    static showAlert(sMessage) {
        alert(sMessage);
    }

}

Refund.processOnLoading();