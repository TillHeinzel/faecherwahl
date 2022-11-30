class Dialog
{
    #promiseBuilder;
    visualElement;
    options;

    constructor(title, level, validOptions)
    {
        const { visualElement, promiseBuilder } = createRadioButtonDialog(namesFromOptions(validOptions), level, title);

        this.visualElement = visualElement;
        this.#promiseBuilder = promiseBuilder;
        this.options = validOptions;
    }

    getPromise()
    {
        return this.#promiseBuilder();
    }

    clear()
    {
        this.visualElement.remove();
    }
}

function namesFromOptions(options)
{
    return options.map(nameFromOption);
}

function nameFromOption(option)
{
    if (option.hasOwnProperty('name')) return option.name;

    if (isRawFach(option)) return stringFromFach(option);

    if (isFaecher(option)) return stringFromFaecher(option.faecher);

    return "";
}

function createRadioButtonDialog(labels, level, legendText)
{
    let fieldset = document.createElement("fieldset");
    let legend = document.createElement("legend");
    legend.innerHTML = legendText;

    fieldset.appendChild(legend);

    const dialogs = document.getElementById("dialogs");
    dialogs.appendChild(fieldset);

    let inputs = [];
    labels.forEach((labeltext, index) =>
    {
        let label = document.createElement("label");
        label.innerHTML = labeltext;

        let input = document.createElement("input");
        input.type = "radio";
        input.name = 'dialog' + level;

        inputs.push(input);

        let div = document.createElement("div");
        div.appendChild(input);
        div.appendChild(label);

        fieldset.appendChild(div);
    });

    promiseBuilder = function ()
    {
        return Promise.race(
            inputs.map(
                (input, index) =>
                {
                    return new Promise(function (resolve, reject)
                    {
                        input.addEventListener('change', function ()
                        {
                            resolve(this);
                        }.bind({ level: level, index: index }));
                    });
                }
            )
        );
    };

    return { visualElement: fieldset, promiseBuilder: promiseBuilder };
}
