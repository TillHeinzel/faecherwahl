const Progression = {
    Invalid: Symbol("invalid"),
    Valid: Symbol("valid"),
    Finished: Symbol("finished")
}

class DialogFlowManager
{
    #conditionEvaluator;

    #openDialogs = [];
    #dialogQueue = [];

    #nextSubDialogLayer = 0

    constructor(conditionEvaluator)
    {
        this.#conditionEvaluator = conditionEvaluator;
    }

    resetToLevel(level)
    {
        const closedDialogs = this.#openDialogs.splice(level + 1, this.#openDialogs.length);

        this.#dialogQueue = this.#dialogQueue.concat(closedDialogs.reverse());

        this.#nextSubDialogLayer = this.#openDialogs.at(-1).layer+1;

        this.#dialogQueue = this.#dialogQueue.filter(e => e.layer <= this.#nextSubDialogLayer - 1);
    }

    hasNextName()
    {
        return this.#dialogQueue.length > 0 /*&& this.#dialogQueue.some(this.#isValidDialog)*/;
    }

    #isValidDialog(dialogData)
    {
        if (!dialogData.hasOwnProperty("if")) return true;

        return this.#conditionEvaluator.evaluate(dialogData.if);
    }

    #nameFromData(dialogData)
    {
        if (dialogData.hasOwnProperty("if")) return dialogData.dialog;

        return dialogData;
    }

    progress()
    {
        if (this.#dialogQueue.length === 0) return { state: Progression.Finished };

        const data = this.#dialogQueue.pop();

        this.#openDialogs.push(data);

        const actualData = data.dialogData;

        if (this.#isValidDialog(actualData))
        {
            return { state: Progression.Valid, name: this.#nameFromData(actualData) };
        }

        return { state: Progression.Invalid };
    }

    push(newDialogs)
    {
        this.#dialogQueue = this.#dialogQueue.concat(shallowCopy(newDialogs).reverse().map(e => ({ dialogData: e, layer: this.#nextSubDialogLayer })));
        this.#nextSubDialogLayer += 1;
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

function shallowCopy(array)
{
    return [...array];
}