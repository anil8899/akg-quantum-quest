const SUPABASE_URL="https://sbcfmibivdvcdortuptw.supabase.co";
const SUPABASE_PUBLISHABLE_KEY="sb_publishable_A6EuKpCgWxwBv8kYO-4P-g_Z58kdTKl";
const supabaseClient=window.supabase.createClient(SUPABASE_URL,SUPABASE_PUBLISHABLE_KEY);

function normalizePhone(value){
  const d=String(value||"").replace(/\D/g,"");
  return d.length===12&&d.startsWith("91")?d.slice(2):d;
}
function setMessage(text,error=false){
  const el=document.getElementById("form-message");
  if(!el)return;
  el.textContent=text;
  el.dataset.error=error?"true":"false";
}
async function submitLead(event){
  event.preventDefault();
  const form=event.currentTarget;
  const button=form.querySelector("button[type=submit]");
  const data=Object.fromEntries(new FormData(form).entries());
  if(data.website)return;
  const phone=normalizePhone(data.phone);
  if(!/^[6-9]\d{9}$/.test(phone)){
    setMessage("Please enter a valid 10-digit Indian mobile number.",true);
    return;
  }
  button.disabled=true;
  button.textContent="Sending…";
  setMessage("Submitting your enquiry…");
  const payload={
    name:String(data.name||"").trim(),
    phone,
    email:String(data.email||"").trim()||null,
    city:"Bengaluru",
    requirement:String(data.interest||"").trim()||"General enquiry",
    source:"Website",
    campaign:"AKG Quantum Quest Website",
    status:"New",
    notes:String(data.message||"").trim()||null
  };
  const{error}=await supabaseClient.from("leads").insert(payload);
  button.disabled=false;
  button.textContent="Send enquiry →";
  if(error){
    console.error(error);
    setMessage("We couldn't submit the enquiry right now. Please call +91 82968 21270.",true);
    return;
  }
  form.reset();
  setMessage("Thank you. Your enquiry has been sent to AKG Quantum Quest.");
}

const menu=document.querySelector(".menu");
if(menu){
  menu.addEventListener("click",()=>{
    const nav=document.querySelector(".nav");
    const open=nav.classList.toggle("menu-open");
    menu.setAttribute("aria-expanded",String(open));
  });
}
document.querySelectorAll(".nav nav a").forEach(a=>{
  a.addEventListener("click",()=>document.querySelector(".nav")?.classList.remove("menu-open"));
});
