/* 

try {
    importScripts('even_handler.js');
  } catch (error) {
    console.error(error);
  }
  
var hosts = [['*://mega.nz/*','*://walla.co.il/*'],['https://www.ourcampus.nl/']]


chrome.storage.local.set({match_unused_host: hosts[0]  , match_live_host :hosts[1],})

function get_host(url) {
    var new_url = 'null'
    try {
        new_url = new URL(url).host
      } catch (_) { 
        return 'null'
      }
    return new_url
}

function host_search(url){
    let host_url = get_host(url)
    let match_url = ''
    if(host_url != 'null'){
        hosts.find(host => match_url = host.find((element) =>{ 
            // console.log('element_found: ' + [element.slice(4,-2)] + '\tcurrent elemnt : ' + [host_url]+ '\tComparison_result: '+ (element.slice(4,-2) ===  host_url) )
            return element.slice(4,-2) ==  host_url
        }))
    }
    // console.log('new match '+[match_url])
    return match_url ? match_url : 'null'
}

async function update_hosts_var(){
    console.log('started_update')
    let new_unused = await chrome.storage.local.get('match_unused_host')
    let new_used = await chrome.storage.local.get('match_live_host')
    hosts[0] = new_unused.match_unused_host
    hosts[1] = new_used.match_live_host
    console.log('finished_update')
    
}

chrome.webRequest.onBeforeRequest.addListener( async (tab) => {
    let get_tabs = await chrome.tabs.get(tab.tabId)
    let from_tab = host_search(get_tabs.url)
    let to_tab = host_search(tab.url )
    // console.log([from_tab] + '--->' + [to_tab] )
    if(from_tab != to_tab){
        console.log(to_tab)
        await chrome.storage.local.set({ 'urls': {from: from_tab ,to : to_tab}})
        console.log('set')
}
},{urls: ["<all_urls>"] , types: ["main_frame"]} ) 


chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
    let response  = 'not loaded'
    if(changeInfo.status == 'complete') {
        let storage_url = await chrome.storage.local.get('urls')
        if (storage_url.urls){
            response = await callme({storage_url})
            await update_hosts_var()
            console.log(hosts[1])
            if(response !='not loaded'){
                await chrome.storage.local.remove('urls')
                let all_storage = await chrome.storage.local.get()
                console.log(all_storage)
                console.log('All')
            }
        }
    }
    // console.log(response)
})

chrome.webRequest.onCompleted.addListener( (req) => {
    let site_name = host_search(req.initiator)
    if(hosts[1].includes(site_name)){
        let stream_property = site_properties[site_name].stream_id
        let stream_indic = req.responseHeaders.find((item =>{
            return item.value == stream_property
        }))
        if(stream_indic){
            let size_stream = req.responseHeaders.find((item =>{
                return item.name == 'Content-Length'})) 
            data_use_update({req_url : site_name ,req_len: size_stream.value })
        }
    }
},{urls: ["<all_urls>"] ,types:['xmlhttprequest'] },['responseHeaders'])

*/
// chrome.windows.onRemoved.addListener((closing_window) => {
//     if(closing_window.isWindowClosing == false){

//     }
// })

/* 

function clear_all_storage ( ){
    chrome.storage.local.clear().then(() => {
        chrome.storage.local.get().then( (all_storage ) => {
            console.log(all_storage)
            console.log('clean')
        })
    })
}

clear_all_storage ()

*/




