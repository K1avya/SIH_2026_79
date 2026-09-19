import { Language } from '@/types/logistics'

export interface TranslationDict {
  appTitle: string
  subTitle: string
  orgBadge: string
  problemId: string
  // Navigation Tabs
  navAdmin: string
  navGISMap: string
  navAIPrediction: string
  navRoutePlanner: string
  navFleetTracking: string
  navFieldReport: string
  navAlerts: string
  // Emergency Mode
  emergencyActive: string
  emergencyInactive: string
  emergencyDesc: string
  // Roles
  roleDistrictAdmin: string
  roleFieldOfficer: string
  roleTransportOperator: string
  roleDisasterResponse: string
  roleSystemAdmin: string
  // Common terms
  statusOpen: string
  statusAtRisk: string
  statusBlocked: string
  riskLow: string
  riskMedium: string
  riskHigh: string
  riskCritical: string
  // KPIs
  kpiConnectivity: string
  kpiOpenRoads: string
  kpiAtRiskRoads: string
  kpiBlockedRoads: string
  kpiActiveIncidents: string
  kpiTrackedFleets: string
  kpiSupplyBuffer: string
  // Field Report
  reportTitle: string
  reportSubtitle: string
  tapGPS: string
  tapType: string
  tapSubmit: string
  offlineBanner: string
  pendingSync: string
  syncNow: string
  // AI
  aiTitle: string
  rainfallRadar: string
  recomputeAI: string
  retrainModel: string
  // Route
  routePlannerTitle: string
  safestRoute: string
  fastestRoute: string
  delayAvoided: string
}

export const TRANSLATIONS: Record<Language, TranslationDict> = {
  en: {
    appTitle: 'NER-LogiQ Intelligence',
    subTitle: 'AI-Based Smart Logistics & Accessibility Platform',
    orgBadge: 'Ministry of Development of North Eastern Region (MDoNER)',
    problemId: 'SIH26002',
    navAdmin: 'Admin Dashboard',
    navGISMap: 'GIS Road Map',
    navAIPrediction: 'AI Disruption Predictor',
    navRoutePlanner: 'Safe Route Planner',
    navFleetTracking: 'Essential Fleet Tracking',
    navFieldReport: 'Field Incident Report',
    navAlerts: 'Alerts & Broadcasts',
    emergencyActive: 'DISASTER EMERGENCY ACTIVE',
    emergencyInactive: 'Standard Monitoring',
    emergencyDesc: 'Showing priority lifeline corridors to isolated districts',
    roleDistrictAdmin: 'District Administrator',
    roleFieldOfficer: 'Field Officer (3-Tap)',
    roleTransportOperator: 'Transport Operator / Driver',
    roleDisasterResponse: 'Disaster Response Team',
    roleSystemAdmin: 'System Administrator',
    statusOpen: 'Open & Accessible',
    statusAtRisk: 'At Risk (Caution)',
    statusBlocked: 'Blocked / Impassable',
    riskLow: 'Low Risk',
    riskMedium: 'Medium Risk',
    riskHigh: 'High Risk',
    riskCritical: 'Critical Disruption',
    kpiConnectivity: 'Overall Regional Connectivity',
    kpiOpenRoads: 'Open Corridors (KM)',
    kpiAtRiskRoads: 'Corridors Under Caution (KM)',
    kpiBlockedRoads: 'Severed Corridors (KM)',
    kpiActiveIncidents: 'Active Field Incidents',
    kpiTrackedFleets: 'Essential Goods Fleets',
    kpiSupplyBuffer: 'Critical Supply Buffer',
    reportTitle: 'Field Incident Quick-Report',
    reportSubtitle: 'Submit geo-tagged ground truth in 3 taps with offline queue',
    tapGPS: 'Step 1: Capture GPS',
    tapType: 'Step 2: Incident Type',
    tapSubmit: 'Step 3: Submit Report',
    offlineBanner: 'OFFLINE MODE ACTIVE: Incident reports queued locally',
    pendingSync: 'reports pending sync',
    syncNow: 'Sync to Cloud Now',
    aiTitle: 'AI Disruption Prediction Engine',
    rainfallRadar: 'Real-time IMD Precipitation Radar & Forecast',
    recomputeAI: 'Recompute Segment Risk Scores',
    retrainModel: 'Audit Predictions vs Actuals',
    routePlannerTitle: 'AI-Based Alternate Route Suggestion',
    safestRoute: 'AI Safest Alternate Route',
    fastestRoute: 'Fastest Direct Route',
    delayAvoided: 'Estimated Disruption Delay',
  },
  hi: {
    appTitle: 'एनईआर-लॉजिक इंटेलिजेंस',
    subTitle: 'पूर्वोत्तर क्षेत्र के लिए एआई-आधारित स्मार्ट लॉजिस्टिक्स प्लेटफॉर्म',
    orgBadge: 'पूर्वोत्तर क्षेत्र विकास मंत्रालय (MDoNER)',
    problemId: 'SIH26002',
    navAdmin: 'प्रशासन डैशबोर्ड',
    navGISMap: 'जीआईएस सड़क मानचित्र',
    navAIPrediction: 'एआई व्यवधान पूर्वानुमान',
    navRoutePlanner: 'सुरक्षित मार्ग योजना',
    navFleetTracking: 'आवश्यक वाहन ट्रैकिंग',
    navFieldReport: 'फील्ड घटना रिपोर्ट',
    navAlerts: 'चेतावनी और सूचनाएं',
    emergencyActive: 'आपदा आपातकाल सक्रिय',
    emergencyInactive: 'सामान्य निगरानी',
    emergencyDesc: 'अलग-थलग जिलों के लिए प्राथमिकता वाले जीवन-रेखा मार्ग प्रदर्शित',
    roleDistrictAdmin: 'जिला प्रशासक',
    roleFieldOfficer: 'फील्ड अधिकारी (3-टैप)',
    roleTransportOperator: 'परिवहन संचालक / चालक',
    roleDisasterResponse: 'आपदा मोचन दल',
    roleSystemAdmin: 'सिस्टम प्रशासक',
    statusOpen: 'खुला और सुलभ',
    statusAtRisk: 'जोखिम में (सावधानी)',
    statusBlocked: 'अवरुद्ध / बंद',
    riskLow: 'कम जोखिम',
    riskMedium: 'मध्यम जोखिम',
    riskHigh: 'उच्च जोखिम',
    riskCritical: 'गंभीर व्यवधान',
    kpiConnectivity: 'समग्र क्षेत्रीय संपर्क',
    kpiOpenRoads: 'खुले मार्ग (किमी)',
    kpiAtRiskRoads: 'चेतावनी वाले मार्ग (किमी)',
    kpiBlockedRoads: 'अवरुद्ध मार्ग (किमी)',
    kpiActiveIncidents: 'सक्रिय जमीनी घटनाएं',
    kpiTrackedFleets: 'आवश्यक माल वाहन',
    kpiSupplyBuffer: 'महत्वपूर्ण आपूर्ति बफर',
    reportTitle: 'फील्ड घटना त्वरित रिपोर्टिंग',
    reportSubtitle: 'ऑफलाइन कतार के साथ 3 टैप में भू-टैग की गई रिपोर्ट जमा करें',
    tapGPS: 'चरण 1: जीपीएस प्राप्त करें',
    tapType: 'चरण 2: घटना का प्रकार',
    tapSubmit: 'चरण 3: रिपोर्ट सबमिट करें',
    offlineBanner: 'ऑफलाइन मोड सक्रिय: रिपोर्ट स्थानीय रूप से संग्रहीत',
    pendingSync: 'रिपोर्ट सिंक हेतु लंबित',
    syncNow: 'क्लाउड में सिंक करें',
    aiTitle: 'एआई व्यवधान भविष्यवाणी इंजन',
    rainfallRadar: 'आईएमडी वर्षा रडार और 6-घंटे का पूर्वानुमान',
    recomputeAI: 'मार्ग जोखिम स्कोर पुनर्गणना',
    retrainModel: 'मॉडल पुनर्शिक्षण ऑडिट',
    routePlannerTitle: 'एआई वैकल्पिक मार्ग सुझाव',
    safestRoute: 'एआई सबसे सुरक्षित वैकल्पिक मार्ग',
    fastestRoute: 'सबसे तेज़ सीधा मार्ग',
    delayAvoided: 'अनुमानित व्यवधान विलंब',
  },
  as: {
    appTitle: 'এনইআৰ-লজিক বুদ্ধিমত্তা',
    subTitle: 'উত্তৰ-পূব অঞ্চলৰ বাবে এআই-আধাৰিত স্মাৰ্ট পৰিবহণ প্লেটফৰ্ম',
    orgBadge: 'উত্তৰ-পূব অঞ্চল উন্নয়ন মন্ত্ৰালয় (MDoNER)',
    problemId: 'SIH26002',
    navAdmin: 'প্ৰশাসন ডেচব’ৰ্ড',
    navGISMap: 'জিআইএছ পথ মানচিত্ৰ',
    navAIPrediction: 'এআই বিঘ্ন ভৱিষ্যদ্বাণী',
    navRoutePlanner: 'নিৰাপদ পথ পৰিকল্পনা',
    navFleetTracking: 'জৰুৰী বাহন ট্ৰেকিং',
    navFieldReport: 'ক্ষেত্ৰ ঘটনা প্ৰতিবেদন',
    navAlerts: 'সতৰ্কবাৰ্তা আৰু ঘোষণা',
    emergencyActive: 'বিপৰ্যয় জৰুৰীকালীন অৱস্থা সক্ৰিয়',
    emergencyInactive: 'সাধাৰণ নিৰীক্ষণ',
    emergencyDesc: 'বিচ্ছিন্ন জিলাসমূহৰ বাবে প্ৰাথমিক জীৱনৰেখা পথসমূহ দেখুওৱা হৈছে',
    roleDistrictAdmin: 'জিলা প্ৰশাসক',
    roleFieldOfficer: 'ক্ষেত্ৰ বিষয়া (৩-টেপ)',
    roleTransportOperator: 'পৰিবহণ অপাৰেটৰ / চালক',
    roleDisasterResponse: 'বিপৰ্যয় সঁহাৰি দল',
    roleSystemAdmin: 'ছিষ্টেম প্ৰশাসক',
    statusOpen: 'খোলা আৰু সুগম',
    statusAtRisk: 'ঝুঁকিত (সাৱধানতা)',
    statusBlocked: 'বন্ধ / অগম্য',
    riskLow: 'কম বিপদ',
    riskMedium: 'মধ্যম বিপদ',
    riskHigh: 'উচ্চ বিপদ',
    riskCritical: 'গুৰুতৰ বিঘ্ন',
    kpiConnectivity: 'সামগ্ৰিক আঞ্চলিক সংযোগ',
    kpiOpenRoads: 'খোলা পথ (কিমি)',
    kpiAtRiskRoads: 'সাৱধানতাৰ পথ (কিমি)',
    kpiBlockedRoads: 'বন্ধ পথ (কিমি)',
    kpiActiveIncidents: 'সক্ৰিয় ঘটনাৰ সংখ্যা',
    kpiTrackedFleets: 'ট্ৰেক কৰা জৰুৰী বাহন',
    kpiSupplyBuffer: 'অত্যাৱশ্যকীয় মজুত সামগ্ৰী',
    reportTitle: 'ক্ষেত্ৰ ঘটনা তাৎক্ষণিক প্ৰতিবেদন',
    reportSubtitle: 'অফলাইন সংৰক্ষণৰ সৈতে ৩ টেপত ভূ-টেগযুক্ত প্ৰতিবেদন জমা দিয়ক',
    tapGPS: 'পদক্ষেপ ১: জিপিএছ লওক',
    tapType: 'পদক্ষেপ ২: ঘটনাৰ প্ৰকাৰ',
    tapSubmit: 'পদক্ষেপ ৩: প্ৰতিবেদন জমা দিয়ক',
    offlineBanner: 'অফলাইন মোড সক্ৰিয়: স্থানীয়ভাৱে জমা হৈছে',
    pendingSync: 'টা প্ৰতিবেদন ছিংকৰ বাবে বাকী',
    syncNow: 'এতিয়াই ক্লাউডলৈ পঠিয়াওক',
    aiTitle: 'এআই বিঘ্ন ভৱিষ্যদ্বাণী ইঞ্জিন',
    rainfallRadar: 'আইএমডি বৰষুণ ৰাডাৰ আৰু পূৰ্বাভাস',
    recomputeAI: 'বিপদৰ স্কোৰ পুনৰ গণনা কৰক',
    retrainModel: 'মডেল পুনৰ প্ৰশিক্ষণ অডিট',
    routePlannerTitle: 'এআই বিকল্প পথ পৰামৰ্শ',
    safestRoute: 'এআই আটাইতকৈ নিৰাপদ বিকল্প পথ',
    fastestRoute: 'দ্ৰুততম পোনপটীয়া পথ',
    delayAvoided: 'সম্ভাব্য পলম সময়',
  },
}
