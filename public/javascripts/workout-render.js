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
            renderWorkout(data)
        }
    }, 250);

})

const renderWorkout = (data) => {
    const workoutContainer = document.querySelector(".workout-container")
    data.forEach(exercise => {
        let exerciseContainer = document.getElementById(exercise._id)
        console.log(exerciseContainer)
        console.log("Test")
        if (!exerciseContainer) {
            console.log("no exercise container found")
            exerciseContainer = document.createElement("div")
            exerciseContainer.classList.add("exercise-container")
            exerciseContainer.setAttribute("id", exercise._id)
            workoutContainer.appendChild(exerciseContainer)
        } else {
            console.log("found exercise container")
            exercise.sets.forEach(set => {
                let setContainer = document.getElementById(set._id)
                if (!setContainer) {
                    console.log("no set container found")
                    setContainer = document.createElement("div")
                    setContainer.classList.add("set-container")
                    setContainer.setAttribute("id", set._id)
                    exerciseContainer.appendChild(setContainer)
                } else {
                    console.log("found set container")
                }
            })
            
        }
    })
}
