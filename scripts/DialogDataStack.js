class DialogDataStack
{
    #dialogStack = [];
    #conditionEvaluator;

    constructor(dialogsData, conditionEvaluator)
    {
        this.dialogsData = dialogsData;
        this.#conditionEvaluator = conditionEvaluator;
    }

    hasDataAt(level)
    {
        return level < this.#filterArrayFromIndex(this.#constructArray(), level).length;
    }

    getDialogData(level)
    {
        const nextDialogName = this.#getDialogName(level);
        return this.#resolveInheritance(deepCopy(this.dialogsData[nextDialogName]));
    }

    push(newLevel, newDialogs)
    {
        this.#clearAbove(newLevel - 1);
        this.#dialogStack.push({
            offset: newLevel,
            dialogs: newDialogs
        });
    }

    #clearAbove(level)
    {
        const indexToClear = this.#dialogStack.findIndex((e) => e.offset > level);
        if (indexToClear === -1)
            return;

        this.#dialogStack.splice(indexToClear, this.#dialogStack.length);
    }

    #getDialogName(index)
    {
        return this.#filterArrayFromIndex(this.#constructArray(), index)[index];
    }

    #constructArray()
    {
        let array = [];

        this.#dialogStack.forEach(({
            offset,
            dialogs
        }) =>
        {

            array = insertAt(array, dialogs, offset);
        });

        return array;
    }

    #filterArrayFromIndex(head, index)
    {
        let tail = head.splice(index, head.length);

        tail = tail.filter(dialog => !dialog.hasOwnProperty("if") || this.#conditionEvaluator.evaluate(dialog.if));

        tail = tail.map(dialog => dialog.hasOwnProperty("if") ? dialog.dialog : dialog);

        head = head.concat(tail);

        return head;
    }

    #resolveInheritance(dialogData)
    {
        if (!dialogData.hasOwnProperty("inherit_from")) return dialogData;

        dialogData.inherit_from.forEach(
            inherit => { dialogData.options = dialogData.options.concat(this.dialogsData[inherit].options); }
        );

        return dialogData;
    }
}

function insertAt(arr1, arr2, index)
{
    const tail = arr1.splice(index, arr1.length);
    return arr1.concat(arr2).concat(tail);
}

function deepCopy(obj)
{
    return JSON.parse(JSON.stringify(obj));
}