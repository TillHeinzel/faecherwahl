main();

async function main()
{
    // chosen classes manager. Also takes care of communicating with the grid showing chosen classes
    const faecherwahlManager = new FaecherwahlManager(connectGridDisplay());

    // Manager for dialog-data. Its a bit complex due to the need to add subdialogs
    const dialogData = new DialogDataStack(await getData('data/dialogs.json'));

    // Manager for the Dialogs the user interacts with. Also takes care of displaying them
    const dialogs = new DialogsManager(new OptionsFilter(faecherwahlManager), document.getElementById("dialogs"));

    // hook up the print-Button, so it can check, whether all dialogs have been taken care of
    document.getElementById('print-button').onclick = makePrintCallback(dialogs, faecherwahlManager)

    // add obligatorische Fächer
    faecherwahlManager.push(await getData('data/obligatorischeFaecher.json'));

    // initialize studienrichtungsdialog
    const initialLevel = 0;
    dialogData.push(initialLevel, ['studienrichtungen'])
    dialogs.openDialog(initialLevel, dialogData.getDialogData(initialLevel));

    // Loop
    while (true)
    {
        const { level, option } = await dialogs.getAnyResponse();

        faecherwahlManager.removeAboveLevel(level);
        faecherwahlManager.push(faecherFromOption(option));

        if (option.hasOwnProperty('subdialogs')) dialogData.push(level + 1, option.subdialogs);

        if (dialogData.hasDataAt(level + 1))
        {
            const dialog = dialogs.openDialog(level + 1, dialogData.getDialogData(level + 1));

            dialog.scrollIntoView({ behavior: "smooth" });
        }
        else
        {
            document.getElementById('metadata').scrollIntoView({ behavior: "smooth" });
        }
    }
}

function makePrintCallback(dialogsManager, faecherwahlManager)
{
    const handler = new PrintHandler(dialogsManager, faecherwahlManager);
    return function ()
    {
        handler.tryPrint();
    }
}

class PrintHandler
{
    #dialogsManager;
    #faecherwahlManager;

    constructor(dialogsManager, faecherwahlManager)
    {
        this.#dialogsManager = dialogsManager;
        this.#faecherwahlManager = faecherwahlManager;
    }

    tryPrint()
    {
        const errorLabel = document.getElementById('errorLabel');
        if (!this.#areDialogsFinished())
        {
            errorLabel.innerHTML = 'Du must in jedem Kasten oben eine Möglichkeit wählen';
            return;
        }
        if (!document.getElementById('nameInput').value.trim().length > 0)
        {
            errorLabel.innerHTML = 'Du musst oben noch deinen Namen eingeben';
            return;
        }
        if (!document.getElementById('klasseInput').value.trim().length > 0)
        {
            errorLabel.innerHTML = 'Du musst oben noch deine Klasse eingeben';
            return;
        }

        errorLabel.innerHTML = ' ';

        window.print()
    }

    #areDialogsFinished()
    {
        if (!this.#dialogsManager || !this.#faecherwahlManager) return false;

        return this.#faecherwahlManager.numberOfChoicesTaken > this.#dialogsManager.numberOfOpenDialogs;
    }
}

function connectGridDisplay()
{
    return new GridDisplay(cartesianProduct(['obligatorisch', 'studienrichtung', 'wahl'], ['C', 'B', 'A']).map(([type, niveau]) => ({
        type: type,
        niveau: niveau,
        element: document.getElementById(type + ' ' + niveau),
    })));

    function cartesianProduct(...a)
    {
        return a.reduce((a, b) => a.flatMap(d => b.map(e => [d, e].flat())));
    }
}

async function getData(relativePath)
{
    return await (await fetch(relativePath)).json();
}

