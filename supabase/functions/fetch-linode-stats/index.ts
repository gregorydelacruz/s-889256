
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.0'

const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
const LINODE_API_KEY = Deno.env.get('LINODE_API_KEY')!

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)

async function getLinodeService() {
  const { data: services, error } = await supabase
    .from('services')
    .select('*')
    .eq('api_key_identifier', 'LINODE_API_KEY')
    .single()
  
  if (error) throw error
  return services
}

async function fetchLinodeStats() {
  const service = await getLinodeService()
  
  // Fetch list of Linode instances
  const instancesResponse = await fetch('https://api.linode.com/v4/linode/instances', {
    headers: {
      'Authorization': `Bearer ${LINODE_API_KEY}`,
      'Content-Type': 'application/json',
    },
  })
  
  if (!instancesResponse.ok) {
    throw new Error(`Failed to fetch Linode instances: ${instancesResponse.statusText}`)
  }
  
  const instances = await instancesResponse.json()
  
  // For each instance, fetch its stats
  for (const instance of instances.data) {
    const statsResponse = await fetch(`https://api.linode.com/v4/linode/instances/${instance.id}/stats`, {
      headers: {
        'Authorization': `Bearer ${LINODE_API_KEY}`,
        'Content-Type': 'application/json',
      },
    })
    
    if (!statsResponse.ok) {
      console.error(`Failed to fetch stats for instance ${instance.id}: ${statsResponse.statusText}`)
      continue
    }
    
    const stats = await statsResponse.json()
    
    // Get the latest CPU, IO, and Network stats
    const latestStats = stats.data[stats.data.length - 1]
    
    // Insert CPU usage metric
    await supabase.from('metrics').insert({
      service_id: service.id,
      metric_name: 'cpu_usage',
      value: latestStats.cpu,
      unit: '%',
      labels: { instance_id: instance.id, instance_label: instance.label }
    })
    
    // Insert memory usage metric (using IO as proxy since memory isn't directly available)
    await supabase.from('metrics').insert({
      service_id: service.id,
      metric_name: 'memory_usage',
      value: (latestStats.io.io * 100) / instance.specs.memory, // Convert to percentage
      unit: '%',
      labels: { instance_id: instance.id, instance_label: instance.label }
    })
    
    // Insert network transfer metric
    const networkTotal = latestStats.netv4.in + latestStats.netv4.out + 
                        latestStats.netv6.in + latestStats.netv6.out
    await supabase.from('metrics').insert({
      service_id: service.id,
      metric_name: 'network_transfer',
      value: networkTotal,
      unit: 'bytes',
      labels: { instance_id: instance.id, instance_label: instance.label }
    })
    
    // Insert storage usage metric
    await supabase.from('metrics').insert({
      service_id: service.id,
      metric_name: 'storage_usage',
      value: (latestStats.io.io * 100) / instance.specs.disk, // Convert to percentage
      unit: '%',
      labels: { instance_id: instance.id, instance_label: instance.label }
    })
  }
}

Deno.serve(async (req) => {
  try {
    await fetchLinodeStats()
    return new Response(JSON.stringify({ message: 'Successfully fetched and stored Linode stats' }), {
      headers: { 'Content-Type': 'application/json' },
      status: 200,
    })
  } catch (error) {
    console.error('Error:', error.message)
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { 'Content-Type': 'application/json' },
      status: 500,
    })
  }
})
