from fastapi import FastAPI, HTTPException
from datetime import datetime
from pydantic import BaseModel
from typing import Dict, List
import httpx

app = FastAPI()


class ConversionDTO(BaseModel):
    date: str
    currency_code: str
    currency_dict: dict[str,float]

class CurrencyData(BaseModel):
    currency_dict: dict[str,float]

class MemoryStatus(BaseModel):
    status: str
    data_index: dict[str,dict[str,list[str]]] # {date: {currency: [*(avaiable target currencies)] } }

class ConversionMemory:
    use_date = True

    # TODO: fetch list of results 
    def __init__(self):
        self.endpoint_template: str = "https://{0}.currency-api.pages.dev/v1/currencies/{1}.json"
        self.conversion_table: dict[str,dict[str,CurrencyData]] = {}
        self.last_status: str = "Ready"

    async def get_conversions(self, sender_code: str, receiver_code: str):
        pass

    async def get_conversion(self, sender_code: str, receiver_code: str) -> float:
        now = datetime.now()
        date_str = f"{now.year}-{str(now.month).zfill(2)}-{str(now.day).zfill(2)}"
        if date_str in self.conversion_table.keys(): 
            if sender_code in self.conversion_table[date_str].keys():
                if not receiver_code in self.conversion_table[date_str][sender_code].currency_dict.keys():
                    self.last_status = "Error 406 " + f"Unsupported currency {receiver_code}"
                    raise HTTPException(status_code=406,detail=f"Unsupported currency {receiver_code}")
                self.last_status = "OK"
                return (date_str,self.conversion_table[date_str][sender_code].currency_dict[receiver_code])

        conversion_obj:ConversionDTO = await self.fetch_conversions(date_str,sender_code)
        self.add_response(conversion_obj)
        if not receiver_code in conversion_obj.currency_dict.keys():
            self.last_status = "Error 406 " + f"Unsupported currency {receiver_code}"
            raise HTTPException(status_code=406,detail=f"Unsupported currency {receiver_code}")
        self.last_status = "OK"
        return (date_str,conversion_obj.currency_dict[receiver_code])

    def add_response(self, entry_data: ConversionDTO):
        if not entry_data.date in self.conversion_table.keys():
            self.conversion_table[entry_data.date] = {}

        if not entry_data.currency_code in self.conversion_table[entry_data.date].keys():
            self.conversion_table[entry_data.date][entry_data.currency_code] = CurrencyData(currency_dict=entry_data.currency_dict)


    async def fetch_conversions(self,date:str, currency: str) -> ConversionDTO:
        self.last_status = "Fetching"
        url = self.endpoint_template.format(date,currency) if self.use_date else self.endpoint_template.format("latest",currency)
        try:
            async with httpx.AsyncClient() as client:
                response = await client.get(url)
                response.raise_for_status() 
                data = response.json() 
            return ConversionDTO(date=date,currency_code=currency,currency_dict=data.get(currency))

        except httpx.HTTPStatusError as e:
            raise HTTPException(status_code=e.response.status_code, detail=str(e))

        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))

    def get_status(self) -> MemoryStatus:
        # db_index = {{date:{curr:list(convl.currency_dict.keys())}} for date,cb_dict in self.conversion_table.items() for curr,convl in cb_dict.items()}
        db_index = {}
        for date,cb_dict in self.conversion_table.items():
            db_index[date] = {}
            for curr,convl in cb_dict.items():
                db_index[date][curr] = list(convl.currency_dict.keys())
        return {"status": self.last_status,"saved_currencies":db_index}

__conversion_kb = ConversionMemory()


@app.get("/api/")
async def fetch_conversion(input_currency:str = "clp", output_currency:str = "usd"):
    input_currency = input_currency.lower()
    output_currency = output_currency.lower()

    result: float = await __conversion_kb.get_conversion(input_currency,output_currency)
    date, conversion = result
    print("date:",date,"conversion:",conversion)
    return {"query_parameters":{"sender":input_currency,"receiver":output_currency,"date":date},"conversion_ratio":conversion}

@app.get("/")
def show_status():
    return  __conversion_kb.get_status()



if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)