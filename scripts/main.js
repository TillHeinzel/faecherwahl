
main();

async function main()
{
    // chosen classes manager. Also takes care of communicating with the grid showing chosen classes
    const faecherwahl = new FaecherwahlManager(connectGridDisplay());

    const possibleDialogsMap = await getData('data/dialogs.json');

    // Manager for dialog-data. Its a bit complex due to the need to add subdialogs
    const dialogFlow = new DialogFlowManager(new Conditions(faecherwahl));

    // Manager for the Dialogs the user interacts with. Also takes care of displaying them
    const openDialogs = new OpenDialogsManager(new OptionsFilter(faecherwahl), document.getElementById("dialogs"));

    // hook up the print-Button, so it can check, whether all dialogs have been taken care of
    document.getElementById('print-button').onclick = makePrintCallback(openDialogs, faecherwahl)

    // add obligatorische Fächer
    faecherwahl.push(await getData('data/obligatorischeFaecher.json'));

    // initialize studienrichtungsdialog
    dialogFlow.push(['studienrichtungen'])
    let nextDialogData = possibleDialogsMap[dialogFlow.progress().name];

    openDialogs.openDialog(nextDialogData);

    // Listening Loop
    while (true)
    {
        const { level, option } = await openDialogs.anyOptionInAnyDialogClicked();

        // reset to handle selection of a previous dialog 
        faecherwahl.resetToLevel(level);
        dialogFlow.resetToLevel(level);
        openDialogs.resetToLevel(level);

        // handle outcome of selected option
        faecherwahl.push(faecherFromOption(option));
        if (option.hasOwnProperty('subdialogs')) dialogFlow.push(option.subdialogs);

        // Progress to get dialogs in new useful state, including opening dialogs or ending dialog interaction (we keep listeing though, to be able to respond to people going back and changing inputs)
        let progressionData = dialogFlow.progress();
        while (progressionData.state === Progression.Invalid)
        {
            openDialogs.addDummyDialog();
            progressionData = dialogFlow.progress();
        }

        if (progressionData.state === Progression.Valid)
        {
            const dialog = openDialogs.openDialog(possibleDialogsMap[progressionData.name]);
            dialog.scrollIntoView({ behavior: "smooth" });

            continue;
        }
        if (progressionData.state === Progression.Finished)
        {
            document.getElementById('print-area').scrollIntoView({ behavior: "smooth", block: "end" });
            // keep listening, because user may still change any option
            continue;
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
        if (!document.getElementById('name-input').value.trim().length > 0)
        {
            errorLabel.innerHTML = 'Du musst oben noch deinen Namen eingeben';
            return;
        }
        if (!document.getElementById('klasse-input').value.trim().length > 0)
        {
            errorLabel.innerHTML = 'Du musst oben noch deine Klasse eingeben';
            return;
        }

        errorLabel.innerHTML = ' ';

        document.getElementById("name-output").innerText = "Name: " + document.getElementById("name-input").value;
        document.getElementById("klasse-output").innerText = "Klasse: " + document.getElementById("klasse-input").value;

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
