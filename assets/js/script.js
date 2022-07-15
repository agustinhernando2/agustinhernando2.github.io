window.onload = iniciar;
 
    const patternCantGasto = /\d{1,}/g;  
    const patternPrimerPalabra = /\b([a-z]*)\b/i;
    const days = ["Lunes","Martes","Miercoles","Jueves","Viern es","Sabado","Domingo"];
    const months = ["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"];

function iniciar(){
    let btnAdd = document.getElementById("btnAdd");
    btnAdd.addEventListener("click",onClickAgregar);
    let btnBorrar = document.getElementById("btnDelete");
    btnBorrar.addEventListener("click",onClickBorrar);
    showExpenses();
}
function onClickBorrar(){
    var monthControl = document.querySelector('input[type="month"]').value;
    const [year,month] = monthControl.split('-');
    
    let spentArray = [];
    let spents = [];
    if(localStorage.spents)
        spentArray = JSON.parse(localStorage.spents);
    spentArray = spentArray.reverse()
    spents = spentArray.filter((array) =>{
        const [y,m,d] = array['dateOfCreation'].split('-');
        return (y === year) && (m === month) ? true : false;
    })
    console.log(spents)
    if (monthControl === "2022-01" || JSON.stringify(spents) === JSON.stringify(spentArray)){alert("Debes ingresar un mes valido")}
    localStorage.clear();
    localStorage.spents =  JSON.stringify(spents);
    showExpenses();
}
function onClickAgregar(){
    let txtlabel = document.getElementById("txtExpense");
    let txtExpense = txtlabel.value;
    txtlabel.value = "";
    let amountExp = txtExpense.match(patternCantGasto);
    let categoriaGasto = txtExpense.replace( amountExp, "").replace(" en ", "");
    console.log(categoriaGasto)
    if(!categoriaGasto ===""){categoriaGasto = categoriaGasto.match(patternPrimerPalabra)[0].toString().toLowerCase();}
    if(amountExp==="" || categoriaGasto ===""){
        alert("Debe ingresar bien el monto, Lea las instrucciones !!!")
        return;
    }
    let date = new Date();
    let dateFormat = date.getFullYear()+"-"+date.getMonth()+"-"+date.getDate();
    const data = 
        {
            "amount": amountExp,
            "category": categoriaGasto,
            "dateOfCreation": dateFormat,
        }
    let spentArray = [];
    if(localStorage.spents)
        spentArray = JSON.parse(localStorage.spents);;
    spentArray.push(data);
    localStorage.spents =  JSON.stringify(spentArray);
    showExpenses();
}
function showExpenses(){
    let div_monthly = document.getElementById("divMonthly");
    let spentArray = [];
    if(localStorage.spents)
        spentArray = JSON.parse(localStorage.spents);
    spentArray = spentArray.reverse()
    const html = spentArray.reduce((accum, current, index, array) =>{
            const [year,month,day] = current['dateOfCreation'].split('-');
            const week = Math.trunc(+day/7);
            if(index == 0){accum += "Año: " + year + "<br>Mes de " + months[month] + "<br>Semana " + week + "<br>"}
            else{
                const [prevYear,prevMonth,prevDay] = array[index - 1]['dateOfCreation'].split('-');
                const prevWeek = Math.trunc(+prevDay/7);
                if(year !== prevYear){
                    let totalMonth = calculateTotal(spentArray, prevYear, prevMonth)
                    accum += "Total gastado en el mes: $"+ totalMonth + "<br>";
                    accum += "Año: " + year + "<br>Mes de " + months[month] + "<br>Semana " + week + "<br>"
                }else if(month !== prevMonth){
                    let totalMonth = calculateTotal(spentArray, prevYear, prevMonth)
                    accum += "Total gastado en el mes: $"+ totalMonth + "<br>";
                    accum += "Mes de " + months[month] + "<br>Semana " + (week+1) + "<br>"                
                }else if(week !== prevWeek){
                    accum += "Semana " + week + "<br>"
                }
            }
            accum +="<"+ current.dateOfCreation+ ">&nbsp . &nbsp . &nbsp . &nbsp$" + current.amount + " en " + current.category + "<br>"
            if(index === array.length - 1){
                let totalMonth = calculateTotal(spentArray, year, month)
                accum += "Total gastado en el mes: $"+ totalMonth + "<br>";
            }
            return accum;
        },"")
    div_monthly.innerHTML = html;    
}
function calculateTotal(spentArray, yearWish, monthWish){

    const filtered = spentArray.filter((array) =>{
        const [year,month,day] = array['dateOfCreation'].split('-');
        
        return month ===monthWish && year === yearWish;
    })
    let sum = 0;
    for(let spent of filtered)
        sum+= +(spent.amount);
    return sum;
}