import { createClient } from
"https://esm.sh/@supabase/supabase-js@2"


const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
}


Deno.serve(async (req) => {

  if (req.method === "OPTIONS") {
    return new Response("ok", {
      headers: corsHeaders
    })
  }


  try {

    const body = await req.text()

    console.log("BODY:", body)


    if (!body) {
      return new Response(
        JSON.stringify({
          error:"Empty request body"
        }),
        {
          headers:{
            ...corsHeaders,
            "Content-Type":"application/json"
          }
        }
      )
    }


    const { query } = JSON.parse(body)


    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    )


    const { data, error } =
      await supabase.rpc(
        "execute_sql",
        {
          sql_query: query
        }
      )


    if(error){

      return new Response(
        JSON.stringify({
          error:error.message
        }),
        {
          headers:{
            ...corsHeaders,
            "Content-Type":"application/json"
          }
        }
      )

    }


    return new Response(
      JSON.stringify({
        result:data
      }),
      {
        headers:{
          ...corsHeaders,
          "Content-Type":"application/json"
        }
      }
    )


  }

  catch(err){

    return new Response(
      JSON.stringify({
        error:err.message
      }),
      {
        headers:{
          ...corsHeaders,
          "Content-Type":"application/json"
        }
      }
    )

  }

})