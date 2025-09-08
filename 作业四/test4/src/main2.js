import * as d3 from "d3";


const sampleData = [
    { date: '9.27', value: 393594 },
    { date: '9.28', value: 377503 },
    { date: '9.29', value: 355161 },
    { date: '9.30', value: 352794 },
    { date: '10.1', value: 337669 },
    { date: '10.2', value: 311291 },
    { date: '10.3', value: 284238 },
    { date: '10.4', value: 277161 },
    { date: '10.5', value: 279333 },
    { date: '10.6', value: 281733 },
    { date: '10.7', value: 254763 },
    { date: '10.8', value: 244712 },
    { date: '10.9', value: 230254 },
    { date: '10.10', value: 215291 },
    { date: '10.11', value: 213331 },
    { date: '10.12', value: 235351 },
    { date: '10.13', value: 208089 },
    { date: '10.14', value: 185283 },
    { date: '10.15', value: 179018 },
    { date: '10.16', value: 174857 },
];


sampleData.forEach((d, i) => {
    if (i === 0) {
        d.change = 0;  // No change for the first day
    } else {
        const previousValue = sampleData[i - 1].value;
        d.change = ((d.value - previousValue) / previousValue) * 100;  // Percent change
    }
});


const svgWidth = 1000, svgHeight = 600, padding = { top: 40, right: 60, bottom: 80, left: 100 };


const svg2 = d3.select("#chart2 svg")
    .attr("width", svgWidth)
    .attr("height", svgHeight);


const gradient = svg2.append("defs")
  .append("linearGradient")
  .attr("id", "barGradient")
  .attr("x1", "0%")
  .attr("y1", "0%")
  .attr("x2", "0%")
  .attr("y2", "100%");
gradient.append("stop").attr("offset", "0%").attr("stop-color", "#6bcef5");
gradient.append("stop").attr("offset", "100%").attr("stop-color", "#0077b6");


svg2.append("defs").append("marker")
    .attr("id", "arrow")
    .attr("markerWidth", 10)
    .attr("markerHeight", 10)
    .attr("refX", 5)
    .attr("refY", 5)
    .attr("orient", "auto")
    .append("path")
    .attr("d", "M0,0 L10,5 L0,10 Z")
    .attr("fill", "#333");


const xScale = d3.scaleBand()
    .domain(sampleData.map(d => d.date))
    .range([padding.left, svgWidth - padding.right])
    .padding(0.1);


const yScale = d3.scaleLinear()
    .domain([0, d3.max(sampleData, d => d.value) * 1.1])  // Add 10% padding to max value
    .range([svgHeight - padding.bottom, padding.top]);


const enlargedBars = new Set();


svg2.selectAll(".bar")
    .data(sampleData)
    .join("rect")
    .attr("class", "bar")
    .attr("x", d => xScale(d.date))
    .attr("y", d => yScale(d.value))
    .attr("width", xScale.bandwidth())
    .attr("height", d => svgHeight - padding.bottom - yScale(d.value))
    .attr("fill", "url(#barGradient)")
    .attr("rx", 6)  // Rounded corners
    .style("filter", "drop-shadow(1px 1px 4px rgba(0, 0, 0, 0.3))")  
    .on("mouseover", function (event, d) {
        const bar = d3.select(this);

        
        const barColor = d.change >= 0 ? "green" : "red";  
        bar.transition().duration(200)
            .attr("fill", barColor); 

        
        svg2.append("text")
            .attr("class", "label")
            .attr("x", xScale(d.date) + xScale.bandwidth() / 2)
            .attr("y", yScale(d.value) - 10) 
            .attr("text-anchor", "middle")
            .text(d.value)
            .attr("fill", "black")
            .attr("font-size", "14px");

        svg2.append("text")
            .attr("class", "change")
            .attr("x", xScale(d.date) + xScale.bandwidth() / 2)
            .attr("y", yScale(d.value) - 25) 
            .attr("text-anchor", "middle")
            .text(`${d.change.toFixed(2)}%`)
            .attr("fill", d.change >= 0 ? "green" : "red")
            .attr("font-size", "14px");
    })
    .on("mouseout", function () {
        const bar = d3.select(this);

        
        bar.transition().duration(200)
            .attr("fill", "url(#barGradient)"); 

        
        svg2.selectAll(".label").remove();
        svg2.selectAll(".change").remove();
    })
    .on("click", function(event, d) {
        const bar = d3.select(this);
        const isEnlarged = enlargedBars.has(d.date);

        if (isEnlarged) {
            // Revert to original size
            bar.transition().duration(200)
                .attr("width", xScale.bandwidth())
                .attr("x", xScale(d.date));
            enlargedBars.delete(d.date);
        } else {
            // Enlarge the bar
            bar.transition().duration(200)
                .attr("width", xScale.bandwidth() * 1.5)
                .attr("x", xScale(d.date) - (xScale.bandwidth() * 0.25));
            enlargedBars.add(d.date);
        }
    });


svg2.append("g")
    .attr("transform", `translate(0,${svgHeight - padding.bottom})`)
    .call(d3.axisBottom(xScale).tickSize(0))
    .selectAll("text")
    .attr("transform", "rotate(-45)")
    .attr("text-anchor", "end")
    .style("font-size", "14px");

svg2.append("g")
    .attr("transform", `translate(${padding.left},0)`)
    .call(d3.axisLeft(yScale).ticks(10))
    .selectAll("text")
    .style("font-size", "14px");


svg2.append("line")
    .attr("x1", padding.left)
    .attr("y1", svgHeight - padding.bottom)
    .attr("x2", svgWidth - padding.right + 10)  
    .attr("y2", svgHeight - padding.bottom)
    .attr("stroke", "#333")
    .attr("stroke-width", 2)
    .attr("marker-end", "url(#arrow)");

svg2.append("line")
    .attr("x1", padding.left)
    .attr("y1", svgHeight - padding.bottom)
    .attr("x2", padding.left)
    .attr("y2", padding.top - 10)  
    .attr("stroke", "#333")
    .attr("stroke-width", 2)
    .attr("marker-end", "url(#arrow)");


svg2.append("text")
    .attr("x", svgWidth / 2)
    .attr("y", svgHeight - padding.bottom / 2 + 30)
    .attr("text-anchor", "middle")
    .attr("font-size", "16px")
    .text("日期");

svg2.append("text")
    .attr("transform", "rotate(-90)")
    .attr("x", -svgHeight / 2)
    .attr("y", padding.left / 2 - 20)
    .attr("text-anchor", "middle")
    .attr("font-size", "16px")
    .text("人数 (/人)");

