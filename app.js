'use strict';
const systemTheme=window.matchMedia('(prefers-color-scheme: dark)');
let themePreference;
try{themePreference=localStorage.getItem('thread-theme')}catch{}
if(!['light','dark'].includes(themePreference))themePreference=null;
const themeToggle=document.createElement('button');
themeToggle.type='button';
themeToggle.className='theme-toggle';
themeToggle.textContent='\u263e';
themeToggle.setAttribute('aria-label','Dark mode');
document.getElementById('openCart').before(themeToggle);
function applyTheme(){
  const dark=themePreference?themePreference==='dark':systemTheme.matches;
  document.documentElement.dataset.theme=dark?'dark':'light';
  themeToggle.setAttribute('aria-pressed',String(dark));
  themeToggle.title=dark?'Switch to light mode':'Switch to dark mode';
  themeToggle.textContent=dark?'\u2600':'\u263e';
}
themeToggle.onclick=()=>{
  themePreference=document.documentElement.dataset.theme==='dark'?'light':'dark';
  try{localStorage.setItem('thread-theme',themePreference)}catch{}
  applyTheme();
};
systemTheme.addEventListener('change',applyTheme);
window.addEventListener('storage',event=>{
  if(event.key==='thread-theme'||event.key===null){
    themePreference=['light','dark'].includes(event.newValue)?event.newValue:null;
    applyTheme();
  }
});
applyTheme();
const products=[{id:1,name:'Everyday White Tee',category:'Tops',price:24,img:'white',tag:'ESSENTIAL',detail:'White · Relaxed fit'},{id:2,name:'City Denim Layer',category:'Layers',price:68,img:'denim',tag:'THE EDIT',detail:'Light blue · Easy layering'},{id:3,name:'Graphic Tee Duo',category:'Tops',price:42,img:'dark',tag:'TWO PACK',detail:'Black & gray · Everyday fit'},{id:4,name:'Weekend White Tee',category:'Tops',price:29,img:'white',tag:'RELAXED',detail:'White · Weekend staple'}];
let category='All',cart=[];const $=id=>document.getElementById(id),money=n=>'$'+n.toFixed(2);try{const saved=JSON.parse(localStorage.getItem('thread-cart'));if(Array.isArray(saved))cart=saved.filter(x=>products.some(p=>p.id===x.id)&&['S','M','L','XL'].includes(x.size)&&Number.isInteger(x.qty)&&x.qty>0).map(x=>({...x,qty:Math.min(99,x.qty)}))}catch{}
function node(tag,cls,text){const e=document.createElement(tag);if(cls)e.className=cls;if(text!==undefined)e.textContent=text;return e}function image(p){const img=node('img');img.src='images/'+p.img+'.jpg';img.alt=p.name+' — illustrative clothing photo';img.loading='lazy';return img}function toast(text){$('toast').textContent=text;$('toast').classList.add('show');clearTimeout(toast.timer);toast.timer=setTimeout(()=>$('toast').classList.remove('show'),2800)}
function save(){try{localStorage.setItem('thread-cart',JSON.stringify(cart))}catch{toast('Browser storage is unavailable; cart stays until you close this page.')}renderCart()}
function renderProducts(){let list=products.filter(p=>(category==='All'||category===p.category)&&p.name.toLowerCase().includes($('search').value.trim().toLowerCase()));if($('sort').value!=='featured')list.sort((a,b)=>$('sort').value==='low'?a.price-b.price:b.price-a.price);$('results').textContent=list.length+' pieces';$('products').replaceChildren();if(!list.length)$('products').append(node('p','empty','No matching pieces. Try a different search.'));list.forEach(p=>{const card=node('article','product'),photo=node('div','photo');photo.append(image(p),node('span','',p.tag));const title=node('div','product-title');title.append(node('h3','',p.name),node('span','',money(p.price)));const actions=node('div','product-actions'),size=node('select');size.setAttribute('aria-label','Size for '+p.name);['S','M','L','XL'].forEach(s=>size.append(node('option','',s)));const add=node('button','add','Add to bag +');add.onclick=()=>{const existing=cart.find(x=>x.id===p.id&&x.size===size.value);if(existing&&existing.qty>=99){toast('Maximum quantity reached');return}if(existing)existing.qty++;else cart.push({id:p.id,size:size.value,qty:1});save();toast(p.name+' added to your bag')};actions.append(size,add);card.append(photo,title,node('p','',p.detail),actions);$('products').append(card)})}
function renderCart(){$('count').textContent=cart.reduce((n,x)=>n+x.qty,0);$('cartItems').replaceChildren();let total=0;if(!cart.length)$('cartItems').append(node('p','empty','Your bag is empty. Find your next favorite.'));cart.forEach(item=>{const p=products.find(p=>p.id===item.id);total+=p.price*item.qty;const row=node('div','cart-row'),info=node('div','cart-info');info.append(node('strong','',p.name),node('small','','Size '+item.size+' · '+money(p.price)));const qty=node('div','qty');const minus=node('button','','−'),plus=node('button','','+');minus.setAttribute('aria-label','Decrease '+p.name+' quantity');plus.setAttribute('aria-label','Increase '+p.name+' quantity');minus.onclick=()=>{item.qty--;if(!item.qty)cart=cart.filter(x=>x!==item);save()};plus.disabled=item.qty>=99;plus.onclick=()=>{item.qty++;save()};qty.append(minus,node('span','',item.qty),plus);info.append(qty);const remove=node('button','remove','Remove');remove.onclick=()=>{cart=cart.filter(x=>x!==item);save()};row.append(image(p),info,remove);$('cartItems').append(row)});$('total').textContent=money(total);$('checkout').disabled=!cart.length}
document.querySelectorAll('[data-cat]').forEach(b=>b.onclick=()=>{category=b.dataset.cat;document.querySelectorAll('[data-cat]').forEach(x=>{x.classList.toggle('active',x===b);x.setAttribute('aria-pressed',String(x===b))});renderProducts()});$('search').oninput=renderProducts;$('sort').onchange=renderProducts;$('openCart').onclick=()=>$('cart').showModal();$('closeCart').onclick=()=>$('cart').close();$('checkout').onclick=()=>{cart=[];save();$('cart').close();toast('Demo order complete! No payment was taken or order placed.')};renderProducts();renderCart();
