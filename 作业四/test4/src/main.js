import * as d3 from "d3";


const data = [
    { province: '黑龙江', students: 1 },
    { province: '吉林', students: 1 },
    { province: '辽宁', students: 4 },
    { province: '内蒙古', students: 6 },
    { province: '北京', students: 1 },
    { province: '天津', students: 15 },
    { province: '河北', students: 6 },
    { province: '山西', students: 2 },
    { province: '山东', students: 9 },
    { province: '河南', students: 13 },
    { province: '江苏', students: 5 },
    { province: '安徽', students: 3 },
    { province: '湖北', students: 6 },
    { province: '四川', students: 6 },
    { province: '重庆', students: 3 },
    { province: '江西', students: 5 },
    { province: '湖南', students: 1 },
    { province: '贵州', students: 1 },
    { province: '福建', students: 5 },
    { province: '广东', students: 3 },
    { province: '云南', students: 1 }
];


const width = 1600, height = 800, margin = { top: 20, right: 60, bottom: 40, left: 120 };


const svg = d3.select("svg")
    .attr("width", width)
    .attr("height", height)
    .style("font-family", "Arial, sans-serif");


const y = d3.scalePoint()
    .domain(data.map(d => d.province))
    .range([margin.top, height - margin.bottom])
    .padding(0.3); 


const x = d3.scaleLinear()
    .domain([0, d3.max(data, d => d.students)])
    .range([margin.left, width / 2 - 40]);


const color = d3.scaleSequential()
    .domain([0, d3.max(data, d => d.students)])
    .interpolator(d3.interpolateRainbow); 

// Tianjin position (moved further to the right)
const tianjinX = width / 2 + margin.right + 300; 
const tianjinY = y('天津');


svg.selectAll(".curve")
    .data(data)
    .join("path")
    .attr("d", d => {
        const x1 = x(d.students);
        const y1 = y(d.province);
        return `M${x1},${y1} C${(x1 + tianjinX) / 2},${y1} ${(x1 + tianjinX) / 2},${tianjinY} ${tianjinX},${tianjinY}`;
    })
    .attr("stroke", d => color(d.students))
    .attr("stroke-width", d => Math.max(d.students * 0.7 + 2, 4)) 
    .attr("fill", "none")
    .attr("opacity", 0.8) 
    .attr("stroke-linejoin", "round") 
    .attr("stroke-linecap", "round");


svg.selectAll(".bar")
    .data(data)
    .join("path")
    .attr("d", d => {
        const barWidth = x(d.students) - margin.left;
        const barHeight = 25; 
        const arrowWidth = 12;
        const x1 = margin.left;
        const y1 = y(d.province) - barHeight / 2;
        return `
            M${x1},${y1} 
            H${x1 + barWidth - arrowWidth} 
            L${x1 + barWidth},${y1 + barHeight / 2} 
            L${x1 + barWidth - arrowWidth},${y1 + barHeight} 
            H${x1} 
            Z
        `;
    })
    .attr("fill", d => color(d.students))
    .on("mouseover", function(event, d) {
        d3.select(this)
            .transition()
            .duration(300)
            .attr("fill", "orange");

       
        svg.append("rect")
            .attr("class", "tooltip-box")
            .attr("x", x(d.students) / 2 + margin.left - 18)
            .attr("y", y(d.province) - 25)
            .attr("width", 35)
            .attr("height", 20)
            .attr("fill", "white")
            .attr("rx", 5)
            .attr("ry", 5)
            .attr("stroke", "gray")
            .attr("stroke-width", 0.5)
            .attr("opacity", 0.9);

        svg.append("text")
            .attr("class", "tooltip")
            .attr("x", x(d.students) / 2 + margin.left)
            .attr("y", y(d.province) - 10)
            .attr("text-anchor", "middle")
            .attr("font-size", "12px")
            .attr("fill", "black")
            .text(`${d.students}人`);
    })
    .on("mouseout", function() {
        d3.select(this)
            .transition()
            .duration(300)
            .attr("fill", d => color(d.students));

        svg.selectAll(".tooltip").remove();
        svg.selectAll(".tooltip-box").remove();
    });


svg.selectAll(".label")
    .data(data)
    .join("text")
    .attr("x", margin.left - 15)
    .attr("y", d => y(d.province) + 5)
    .attr("text-anchor", "end")
    .attr("font-size", "14px")
    .attr("font-weight", "bold")
    .attr("fill", "#333")
    .text(d => d.province);


svg.append("image")
    .attr("xlink:href", "https://th.bing.com/th/id/R.6c47652ab9ecc1c1e95dd50e1ee341c5?rik=CL5wSRywZOru4Q&pid=ImgRaw&r=0") 
    .attr("x", tianjinX - 40) 
    .attr("y", tianjinY - 40) 
    .attr("width", 80) 
    .attr("height", 80); 


svg.append("text")
    .attr("x", tianjinX)
    .attr("y", tianjinY - 50)
    .attr("text-anchor", "middle")
    .attr("font-size", "22px")
    .attr("fill", "black")
    .attr("font-weight", "bold")
    .text("南开大学");


svg.append("line")
    .attr("x1", tianjinX)
    .attr("y1", tianjinY + 18)
    .attr("x2", tianjinX)
    .attr("y2", tianjinY + 90)
    .attr("stroke", "gray")
    .attr("stroke-width", 1)
    .attr("stroke-dasharray", "4");


svg.append("text")
    .attr("x", tianjinX)
    .attr("y", tianjinY + 105)
    .attr("text-anchor", "middle")
    .attr("font-size", "18px")
    .attr("fill", "black")
    .text("来自天津的同学最多，共15人，占到总数的15%");
