use wasm_bindgen::prelude::*;
use js_sys::{Array, Function, Object, Promise, Reflect};
use wasm_bindgen::JsCast;
use std::cell::RefCell;
use std::rc::Rc;

#[wasm_bindgen]
#[derive(Clone)]
pub struct Channel {
    queue: Rc<RefCell<Vec<JsValue>>>,
    closed: Rc<RefCell<bool>>,
    capacity: usize,
    senders: Rc<RefCell<Vec<Function>>>,
    receivers: Rc<RefCell<Vec<Function>>>,
}

#[wasm_bindgen]
impl Channel {
    #[wasm_bindgen(constructor)]
    pub fn new(capacity: usize) -> Channel {
        Channel {
            queue: Rc::new(RefCell::new(Vec::new())),
            closed: Rc::new(RefCell::new(false)),
            capacity,
            senders: Rc::new(RefCell::new(Vec::new())),
            receivers: Rc::new(RefCell::new(Vec::new())),
        }
    }

    #[wasm_bindgen(js_name = "send")]
    pub fn send(&self, value: JsValue) -> Promise {
        let queue = Rc::clone(&self.queue);
        let closed = Rc::clone(&self.closed);
        let capacity = self.capacity;
        let senders = Rc::clone(&self.senders);
        let receivers = Rc::clone(&self.receivers);
        let value = value.clone();

        let promise = js_sys::Promise::new(&mut |resolve, reject| {
            let create_closed_error = || -> JsValue {
                let error = Object::new();
                Reflect::set(&error, &"name".into(), &"ChannelError".into()).unwrap();
                Reflect::set(&error, &"message".into(), &"Cannot send on closed channel".into()).unwrap();
                error.into()
            };

            if *closed.borrow() {
                reject.call1(&JsValue::null(), &create_closed_error()).unwrap();
                return;
            }

            if queue.borrow().len() >= capacity {
                senders.borrow_mut().push(resolve.clone().dyn_into().unwrap());
            } else {
                queue.borrow_mut().push(value.clone());
                
                if !receivers.borrow().is_empty() {
                    if let Some(receiver_resolve) = receivers.borrow_mut().pop() {
                        receiver_resolve.call0(&JsValue::null()).unwrap();
                    }
                }
                
                resolve.call0(&JsValue::null()).unwrap();
            }
        });

        promise
    }

    #[wasm_bindgen(js_name = "trySend")]
    pub fn try_send(&self, value: JsValue) -> bool {
        if *self.closed.borrow() || self.queue.borrow().len() >= self.capacity {
            return false;
        }

        self.queue.borrow_mut().push(value);
        
        if !self.receivers.borrow().is_empty() {
            if let Some(resolve) = self.receivers.borrow_mut().pop() {
                resolve.call0(&JsValue::null()).unwrap();
            }
        }
        
        true
    }

    #[wasm_bindgen(js_name = "receive")]
    pub fn receive(&self) -> Promise {
        let queue = Rc::clone(&self.queue);
        let closed = Rc::clone(&self.closed);
        let receivers = Rc::clone(&self.receivers);
        let senders = Rc::clone(&self.senders);
        
        let promise = js_sys::Promise::new(&mut |resolve, _reject| {
            if queue.borrow().is_empty() {
                if *closed.borrow() {
                    let result = create_none_option();
                    resolve.call1(&JsValue::null(), &result).unwrap();
                    return;
                }
                
                receivers.borrow_mut().push(resolve.clone().dyn_into().unwrap());
            } else {
                let value = queue.borrow_mut().remove(0);
                
                let result = create_some_option(value);
                
                if !senders.borrow().is_empty() {
                    if let Some(sender_resolve) = senders.borrow_mut().pop() {
                        sender_resolve.call0(&JsValue::null()).unwrap();
                    }
                }
                
                resolve.call1(&JsValue::null(), &result).unwrap();
            }
        });
        
        promise
    }

    #[wasm_bindgen(js_name = "tryReceive")]
    pub fn try_receive(&self) -> JsValue {
        if self.queue.borrow().is_empty() {
            return create_none_option();
        }

        let value = self.queue.borrow_mut().remove(0);
        
        if !self.senders.borrow().is_empty() {
            if let Some(resolve) = self.senders.borrow_mut().pop() {
                resolve.call0(&JsValue::null()).unwrap();
            }
        }
        
        create_some_option(value)
    }

    #[wasm_bindgen(js_name = "close")]
    pub fn close(&self) {
        *self.closed.borrow_mut() = true;
        
        let create_closed_error = || -> JsValue {
            let error = Object::new();
            Reflect::set(&error, &"name".into(), &"ChannelError".into()).unwrap();
            Reflect::set(&error, &"message".into(), &"Cannot send on closed channel".into()).unwrap();
            error.into()
        };
        
        for resolver in self.senders.borrow_mut().drain(..) {
            resolver.call1(&JsValue::null(), &create_closed_error()).unwrap();
        }
        
        for resolver in self.receivers.borrow_mut().drain(..) {
            resolver.call0(&JsValue::null()).unwrap();
        }
    }

    #[wasm_bindgen(getter)]
    pub fn closed(&self) -> bool {
        *self.closed.borrow()
    }
}

fn create_some_option(value: JsValue) -> JsValue {
    let result = Object::new();
    Reflect::set(&result, &"isSome".into(), &JsValue::from(true)).unwrap();
    Reflect::set(&result, &"value".into(), &value).unwrap();
    result.into()
}

fn create_none_option() -> JsValue {
    let result = Object::new();
    Reflect::set(&result, &"isSome".into(), &JsValue::from(false)).unwrap();
    result.into()
}

#[wasm_bindgen]
pub struct Sender {
    channel: Channel,
}

#[wasm_bindgen]
impl Sender {
    #[wasm_bindgen(constructor)]
    pub fn new(channel: Channel) -> Sender {
        Sender { channel }
    }
    
    #[wasm_bindgen(js_name = "send")]
    pub fn send(&self, value: JsValue) -> Promise {
        self.channel.send(value)
    }
    
    #[wasm_bindgen(js_name = "trySend")]
    pub fn try_send(&self, value: JsValue) -> bool {
        self.channel.try_send(value)
    }
    
    #[wasm_bindgen(js_name = "close")]
    pub fn close(&self) {
        self.channel.close();
    }
    
    #[wasm_bindgen(getter)]
    pub fn closed(&self) -> bool {
        self.channel.closed()
    }
}

#[wasm_bindgen]
pub struct Receiver {
    channel: Channel,
}

#[wasm_bindgen]
impl Receiver {
    #[wasm_bindgen(constructor)]
    pub fn new(channel: Channel) -> Receiver {
        Receiver { channel }
    }
    
    #[wasm_bindgen(js_name = "receive")]
    pub fn receive(&self) -> Promise {
        self.channel.receive()
    }
    
    #[wasm_bindgen(js_name = "tryReceive")]
    pub fn try_receive(&self) -> JsValue {
        self.channel.try_receive()
    }
    
    #[wasm_bindgen(getter)]
    pub fn closed(&self) -> bool {
        self.channel.closed()
    }
}

#[wasm_bindgen(js_name = "createChannel")]
pub fn create_channel(capacity: Option<usize>) -> Array {
    let channel = Channel::new(capacity.unwrap_or(std::usize::MAX));
    let sender = Sender::new(channel.clone());
    let receiver = Receiver::new(channel);
    
    let result = Array::new();
    result.push(&sender.into());
    result.push(&receiver.into());
    result
}