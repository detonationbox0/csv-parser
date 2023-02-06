/**
 * This file is loaded via the <script> tag in the index.html file and will
 * be executed in the renderer process for that window. No Node.js APIs are
 * available in this process because `nodeIntegration` is turned off and
 * `contextIsolation` is turned on. Use the contextBridge API in `preload.js`
 * to expose Node.js functionality from the main process.
 */

let json = {};

$(() => {
    console.log("Ready!");
});

/* Load chosen CSV into Tabulator table */
$("#csv").on("change", async () => {
    // Convert the CSV data to a JSON object
    const csvPath = document.getElementById("csv").files[0].path;
    json = await window.api.getJson(csvPath);

    // Populate a tabulator table
    var table = new Tabulator("#tabulator-table", {
        data:json.data, //assign data to table
        autoColumns:true, //create columns from data field names
        pagination:"local",
        paginationSize:6,
    });

})


$("#btn_parse").on("click", async () => {
    
    const method = $("#method option:selected").attr("script");
    console.log(method);
    switch (method) {
        case("unstack"):
            // Get options from DOM
            const id = $("#unstack_id").val();
            const head = $("#unstack_head").val();
            const val = $("#unstack_value").val();
            const csv = unstack(json, id, head, val);
    }

    // Download the CSV data


});

/**
 * ~~ Unstack ~~
 * Given an ID, Header, and Stacked column,
 * Unstack the table
 * 
 * Example:
 * | ID | Header | Value                  |
 * | -- | ------ | ---------------------- |
 * | 1  | Name   | Todd                   |
 * | 1  | Email  | todd@themailshark.com  |
 * | 1  | Phone  | (555) 201-0183         |
 * | 2  | Name   | James                  |
 * | 2  | Email  | james@themailshark.com |
 * | 2  | Phone  | (555) 203-0223         |
 * 
 * Converts to:
 * | ID | Name  | Email                  | Phone          |
 * | -- | ----- | ---------------------- | -------------- |
 * | 1  | Todd  | todd@themailshark.com  | (555) 201-0183 |
 * | 1  | James | james@themailshark.com | (555) 203-0223 |
 * @param json {json} The JSON object from papaparse to be processed
 * @returns CSV as a string
 */

const unstack = (json, id, head, val) => {

    const jsonData = json.data;

    // Create array with length of jsonData empty arrays
    let ob = {};


    jsonData.forEach((row, i) => {

        let idVal = row[id];
        let headVal = row[head];
        let valVal = row[val];

        if (ob.hasOwnProperty(idVal)) {
            ob[idVal][headVal]= valVal;
        } else {
            ob[idVal] = {
                id:row[id],
            }

            ob[idVal][headVal]= valVal;
        }
    })

    // Flatten the object
    const flat = flattenObj(ob);
    console.log(flat);

}

// Declare a flatten function that takes
// object as parameter and returns the
// flatten object
const flattenObj = (ob) => {
 
    // The object which contains the
    // final result
    let result = {};
 
    // loop through the object "ob"
    for (const i in ob) {
 
        // We check the type of the i using
        // typeof() function and recursively
        // call the function again
        if ((typeof ob[i]) === 'object' && !Array.isArray(ob[i])) {
            const temp = flattenObj(ob[i]);
            for (const j in temp) {
 
                // Store temp in result
                result[i + '.' + j] = temp[j];
            }
        }
 
        // Else store ob[i] in result directly
        else {
            result[i] = ob[i];
        }
    }
    return result;
};