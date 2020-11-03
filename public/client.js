window.onload = () => {
  update_page();
};

function perform_get(page_endpoint, callback) {
  fetch(page_endpoint, { method: "GET" })
    .then((response) => {
      if (response.ok) return response.json();
      throw new Error("Request Failed");
    })
    .then((response) => callback(response))
    .catch((err) => console.log(err));
}

function update_page() {
  perform_get("/contents", (response) => {
    document.getElementById("title").innerHTML = response.title;
    generateContents(document.getElementById("contents"), response.modules);
    set_up_buttons();
  });
}

function generateContents(container, modules) {
  modules.forEach((value, index) => {
    let module = document.createElement("div");

    let title = document.createElement("h2");
    title.innerHTML = value.name;

    // display window contents
    let display_window = document.createElement("div");

    let display_content = document.createElement("p");
    display_content.innerHTML = value.content;
    let edit_button = document.createElement("button");
    edit_button.innerHTML = "Edit";

    display_window.appendChild(display_content);
    display_window.appendChild(edit_button);

    // edit window contents
    let edit_window = document.createElement("div");

    let editable_content = document.createElement("textarea");
    editable_content.cols = 150;
    editable_content.rows = 20;
    let submit_changes_button = document.createElement("button");
    submit_changes_button.innerHTML = "Submit Changes";

    edit_window.appendChild(editable_content);
    edit_window.appendChild(document.createElement("br"));
    edit_window.appendChild(submit_changes_button);

    edit_button.addEventListener("click", () => {
      editable_content.value = display_content.innerHTML;
      module.replaceChild(edit_window, display_window);
    });

    submit_changes_button.addEventListener("click", () => {
      display_content.innerHTML = editable_content.value;
      fetch("/submit_changes", { method: "POST" }).then((response) => {
        // do something here
        // This is what we have to figure out now
        // fetch probably also isn't the right command to use for this
      });
      module.replaceChild(display_window, edit_window);
    });

    module.appendChild(document.createElement("hr"));
    module.appendChild(title);
    module.appendChild(display_window);

    container.appendChild(module);
  });
}

function set_up_buttons() {}

// const button = document.getElementById("myButton");
// button.addEventListener("click", function (e) {
//   console.log("button was clicked");

//   fetch("/clicked", { method: "POST" })
//     .then(function (response) {
//       if (response.ok) {
//         console.log("click was recorded");
//         return;
//       }
//       throw new Error("Request failed.");
//     })
//     .catch(function (error) {
//       console.log(error);
//     });
// });
