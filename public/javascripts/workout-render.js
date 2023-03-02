const form = document.getElementById("exercise-form")
form.addEventListener("submit", () => {
    setTimeout(() => {
        // Get the date and submit a GET request to return the user's workout for that date
        const date = document.getElementById("workout-input").value
        const xhttp = new XMLHttpRequest()
        xhttp.open("GET", "/workouts/" + date)
        xhttp.send()
        xhttp.onload = function () {
            // Clear the comment fields
            resetComments()
            
            // Parse the response data
            let data = JSON.parse(this.response)
            console.log(JSON.stringify(data, null, 4))
            console.log(data[0].sets[0].sets_count)
            renderWorkout(data)
        }
    }, 250);

})

const renderWorkout = (data) => {
    const workoutContainer = document.querySelector(".workout-container")
    const para = document.createElement("p")
    para.textContent = data[0].sets[0].sets_count
    workoutContainer.appendChild(para)
}
