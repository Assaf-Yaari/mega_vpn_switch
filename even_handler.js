


//let changeColor = document.getElementById("nord_download");

// overarching function to call all streaming functions below 

// write to csv function 


// chrome.storage.local.get([req],(x)=> {console.log(x)})
// match_unused_host match_live_host


//

var site_properties = { '*://mega.nz/*': { data: 5368709120 , stream_id: 'application/octet-stream'},
'*://walla.co.il/*': { data: 1000000000 , stream_id: 'application/octet-stream'}
}


async function data_use_update(req_msg){
    //console.log('update_start')
    let current_val = await chrome.storage.local.get([req_msg.req_url])
    await chrome.storage.local.set({[req_msg.req_url]: (current_val[req_msg.req_url] - req_msg.req_len)})
    if(current_val <= 200000000)
        console.log('close_to_empty')
//     let updated_val =  await chrome.storage.local.get([req_msg.req_url])
//     console.log('updated with value: ')
//     console.log(updated_shit)
}

async function url_action(tabq){
    console.log('start url_count')
    let url_navig = Object.entries(tabq.urls)
    for( let i = 0 ; i < url_navig.length ; i++ ){
        if(url_navig[i][1] != 'null'){     
            let url_len = await chrome.tabs.query({url:[url_navig[i][1]]}) 
            if(url_len.length > 0 && url_navig[i][0] == 'from' ){
                tabq.urls.from = ''
                console.log('from')
            }
            else if (url_len.length > 1  && url_navig[i][0] == 'to'){
                tabq.urls.to = ''
                console.log('to')
            }}
    }
    console.log('end url_count')
}


async function proveider_list_update (req , remove , add )  {
    let remove_storage = await chrome.storage.local.get([remove])
    if(remove_storage[remove]){ 
        // console.log('get host')
        var find_host = remove_storage[remove].find(element => element == req)
        if(find_host){ 
            // console.log('hosts found')
            let add_storage = await chrome.storage.local.get([add])
            // console.log('get add')
            if(add_storage){
                let resp = await chrome.storage.local.set({[remove]: remove_storage[remove].filter(host => host != req) , 
                    [add]: add_storage[add].concat(find_host)   
                })
                console.log(resp) 
                let host_count = await chrome.storage.local.get([req])
                if(Object.keys(host_count) == 0)
                    await chrome.storage.local.set({[req]: site_properties[req].data})
                return true
            }     
        }        
    }
}

async function selection_process(message){
    switch(message.text){
        case 'open':
            await proveider_list_update(message.req_url , 'match_unused_host', 'match_live_host' )
            break;
        case 'close':
            await proveider_list_update(message.req_url , 'match_live_host' ,'match_unused_host' )
            break;
    }
}

async function callme (message){
    await url_action(message.storage_url)
    let u_perators = Object.entries(message.storage_url.urls)
    for(let x = 0 ; x < u_perators.length ; x++ ){
        if(u_perators[x])
            await selection_process({req_url: u_perators[x][1] , text:  u_perators[x][0] == 'to' ? 'open':'close' })
    }
    return true 
}

// chrome.runtime.onSuspend.addListener( async () =>{
//     console.log('yo')   
//     await chrome.runtime.sendMessage({url: [document.url] , msg: 'count' })
// })


//site_data[req.slice(4,-2).replace(".","_")] 