use actix_cors::Cors; // Import Cors
use actix_files as fs;
use actix_web::{App, HttpResponse, HttpServer, Responder, get, post, web};
use rand::Rng;
use serde::{Deserialize, Serialize};

#[derive(Deserialize)]
struct PredictionRequest {
    features: Vec<f64>, // Use f64 for floating-point numbers
}

#[derive(Deserialize, Serialize)]
struct PythonPredictionResponse {
    prediction: f64,
    outbreak_risk: String,
}

#[derive(Serialize)]
struct SymptomDataPoint {
    label: String,
    value: i32,
}

#[derive(Serialize)]
struct MapHotspot {
    id: i32,
    location: String,
    disease: String,
    risk: f64,
    cases: i32,
    lat: f64,
    lon: f64,
}

#[derive(Serialize)]
struct Alert {
    message: String,
    #[serde(rename = "type")]
    alert_type: String,
}

#[derive(Serialize)]
struct DashboardData {
    total_cases: i32,
    active_alerts: i32,
    symptom_data: Vec<SymptomDataPoint>,
    map_hotspots: Vec<MapHotspot>,
    alerts: Vec<Alert>,
}

fn generate_map_data(num_hotspots: i32) -> Vec<MapHotspot> {
    let mut hotspots = Vec::new();
    let locations = [
        "Pahadi Gaon",
        "Jungle Basti",
        "Riverside Town",
        "Hilltop Village",
        "Dhalpur",
        "Chandrasekharpur",
        "Patia",
        "Saheed Nagar",
        "Rasulgarh",
        "Nayapalli",
    ];
    let diseases = ["Cholera", "Typhoid", "Hepatitis A", "Diarrhea"];
    let mut rng = rand::thread_rng();
    let bhubaneswar_lat = 20.2961;
    let bhubaneswar_lon = 85.8245;

    for i in 0..num_hotspots {
        hotspots.push(MapHotspot {
            id: i,
            location: locations[i as usize % locations.len()].to_string(),
            disease: diseases[i as usize % diseases.len()].to_string(), // Cycle through diseases
            risk: rng.r#gen(),
            cases: rng.gen_range(5..=70), // Slightly adjusted case range
            lat: bhubaneswar_lat + (rng.r#gen::<f64>() - 0.5) * 0.25, // Wider spread
            lon: bhubaneswar_lon + (rng.r#gen::<f64>() - 0.5) * 0.25,
        });
    }
    hotspots
}

#[get("/api/dashboard-data")]
async fn get_dashboard_data() -> impl Responder {
    let data = DashboardData {
        total_cases: 5432,
        active_alerts: 17,
        symptom_data: vec![
            SymptomDataPoint {
                label: "May".to_string(),
                value: 25,
            },
            SymptomDataPoint {
                label: "Jun".to_string(),
                value: 35,
            },
            SymptomDataPoint {
                label: "Jul".to_string(),
                value: 30,
            },
            SymptomDataPoint {
                label: "Aug".to_string(),
                value: 20,
            },
            SymptomDataPoint {
                label: "Sep".to_string(),
                value: 28,
            },
            SymptomDataPoint {
                label: "Oct".to_string(),
                value: 40,
            },
        ],
        map_hotspots: generate_map_data(10),
        alerts: vec![
            Alert {
                message: "Confirmed Cholera outbreak in village 'Pahadi Gaon'".to_string(),
                alert_type: "critical".to_string(),
            },
            Alert {
                message: "Water turbidity levels rising in source 'Bhagirathi'".to_string(),
                alert_type: "warning".to_string(),
            },
            Alert {
                message: "Spike in fever symptoms reported via mobile app".to_string(),
                alert_type: "info".to_string(),
            },
        ],
    };

    HttpResponse::Ok().json(data)
}

#[post("/api/predict")] // New endpoint to call the Python service
async fn predict_outbreak(req_body: web::Json<PredictionRequest>) -> impl Responder {
    let client = reqwest::Client::new();
    let python_api_url = "http://127.0.0.1:5001/predict";

    // Forward the request to the Python microservice
    let res = client
        .post(python_api_url)
        .json(&req_body.features)
        .send()
        .await;

    match res {
        Ok(response) => {
            if response.status().is_success() {
                let prediction_response: PythonPredictionResponse = response.json().await.unwrap();
                HttpResponse::Ok().json(prediction_response)
            } else {
                HttpResponse::BadGateway().body("Failed to get prediction from Python service")
            }
        }
        Err(_) => HttpResponse::InternalServerError().body("Failed to connect to Python service"),
    }
}

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    println!("🚀 Server starting at http://127.0.0.1:8080");

    HttpServer::new(|| {
        let cors = Cors::default()
            .allowed_origin("http://localhost:5173")
            .allowed_methods(vec!["GET", "POST"]) // Allow POST method
            .allow_any_header()
            .max_age(3600);

        App::new()
            .wrap(cors)
            .service(get_dashboard_data)
            .service(predict_outbreak) // Register the new service
            .service(fs::Files::new("/", "../client/dist").index_file("index.html"))
    })
    .bind(("127.0.0.1", 8080))?
    .run()
    .await
}
