const {test}=require('node:test');const assert=require('node:assert/strict');const {bmi,suggestions}=require('./health');
test('BMI uses kilograms and centimeters and handles missing measurements',()=>{assert.ok(Math.abs(bmi(70,170)-24.22145)<0.001);assert.equal(bmi(70,0),null);assert.equal(bmi(undefined,170),null);});
test('urgent symptoms prioritize emergency care over exercise',()=>{const s=suggestions({symptom:'urgent',sleep:5});assert.equal(s.length,1);assert.equal(s[0].type,'urgent');});
test('fever and short sleep tailor recovery guidance',()=>{const s=suggestions({symptom:'fever',sleep:6});assert.ok(s.some(x=>x.title==='Give recovery some space'));assert.ok(s.some(x=>x.title==='Protect your wind-down time'));});
