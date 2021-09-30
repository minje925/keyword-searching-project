

// Pie Chart Example
// [<%-JSON.stringify(data[0][1])%>, <%-JSON.stringify(data[0][2])%>]
var ctx = document.getElementById("myPieChart2");
var myPieChart = new Chart(ctx, {
    type: 'pie',
    data: {
    labels: ["PC", "Mobile"],
    datasets: [{
    data: [<%-data[0][1]%>, <%-data[0][2]%>],
    backgroundColor: ['#007bff', '#dc3545'],
    }],
    },
});
