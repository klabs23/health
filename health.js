(function(root){
function bmi(weight,height){return weight > 0 && height > 0 ? weight / (height/100)**2 : null;}
function suggestions(p){
const items=[];
if(p.symptom==='urgent') return [{title:'Get urgent medical help',text:'Chest pain, trouble breathing, sudden weakness, or confusion need immediate medical attention. Call your local emergency number.',type:'urgent'}];
if(p.symptom==='fever') items.push({title:'Give recovery some space',text:'Rest, drink fluids, and pause strenuous training. Fever can have many causes; contact a clinician if it persists or worsens. Symptoms alone cannot confirm an infection.'});
if(p.symptom==='soreness') items.push({title:'Choose a lighter session',text:'Try gentle walking and comfortable mobility. Persistent, severe, or unexplained pain should be assessed by a clinician.'});
if(p.sleep<7) items.push({title:'Protect your wind-down time',text:'Aim for 7–9 hours of sleep as an adult. Set a consistent bedtime and leave a quiet 30-minute buffer.'});
if(p.symptom!=='fever') items.push({title:'Build strength, gradually',text:'Aim for two strength sessions a week. Start with comfortable chair squats, wall push-ups, and light rows; leave a rest day between sessions.'});
if(p.symptom!=='fever') items.push({title:'Make movement a daily ritual',text:'Build toward 150 minutes of moderate activity per week. A 10-minute walk is a useful place to start; increase at a pace that feels comfortable.'});
items.push({title:'Add color to your next meal',text:'Choose vegetables, fruit, whole grains, and a protein source. Drink to thirst unless your clinician recommends a fluid limit.'});
return items;
}
const api={bmi,suggestions};if(typeof module!=='undefined')module.exports=api;else root.Health=api;
})(typeof window!=='undefined'?window:globalThis);
