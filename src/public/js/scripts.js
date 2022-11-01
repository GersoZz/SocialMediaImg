if (document.location.href.split("/").includes("images")) {
  document
    .getElementById("btn-toggle-comment")
    .addEventListener("click", (e) => {
      e.preventDefault();
      document.getElementById("post-comment").classList.toggle("d-none");
    });

  document.getElementById("btn-like").addEventListener("click", (e) => {
    e.preventDefault();

    //console.log(e.target.dataset.id);

    const imageId = e.target.dataset.id;

    fetch("/images/" + imageId + "/like", {
      method: "POST",
    })
      .then(function (response) {
        return response.json();
      })
      .then((data) => {
        console.log(data);
        document.getElementsByClassName("likes-count")[0].innerText =
          data.likes;
      });
  });
  document.getElementById("btn-delete").addEventListener("click", (e) => {
    e.preventDefault();

    //confirm()
/*     console.log(e.target) */
    const imageId = e.target.dataset.id;
    //   console.log(e.target)

    const response = confirm("Are you sure you want to delete this image?");
    if (response) {
      console.log(imageId);

      fetch("/images/" + imageId, {
        method: "DELETE",
      })
        .then(function (response) {
          return response.json();
        })
        .then((data) => {
          console.log(data);

          e.target.classList.remove("btn-danger");
          e.target.classList.add("btn-success");

          e.target.getElementsByTagName("i")[0].classList.remove("fa-times");
          e.target.getElementsByTagName("i")[0].classList.add("fa-check");

          e.target.childNodes[1].textContent=' Deleted'

          /* document.getElementById("spanDel").innerText = Deleted; */
          //document.getElementsByClassName('likes-count')[0].innerText=data.likes;
        });
    }
  });
}
