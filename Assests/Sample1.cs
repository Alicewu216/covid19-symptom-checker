using System;
using System.Net;
using System.Linq;
using Newtonsoft.Json.Linq;


namespace EndlessMedicalAPI_Samples
{
	
	public class Sample1
	{
		private static string _BaseURL = "http://api.endlessmedical.com/v1/dx";
		
		public void Run()
		{
			var wc = new WebClient();
			
			var arrComma = new char[] { ',' };
			
			string strJSONInitSession = wc.DownloadString(_BaseURL + "/InitSession");
			var jObject = JObject.Parse(strJSONInitSession);
			
			string strSessionID = jObject.GetValue("SessionID").Value<string>();
			
			var respAcceptTerms = wc.UploadString(string.Format(_BaseURL + "/AcceptTermsOfUse?SessionID={0}&passphrase=I%20have%20read,%20understood%20and%20I%20accept%20and%20agree%20to%20comply%20with%20the%20Terms%20of%20Use%20of%20EndlessMedicalAPI%20and%20Endless%20Medical%20services.%20The%20Terms%20of%20Use%20are%20available%20on%20endlessmedical.com", strSessionID), "");
			
			int iAge = new Random().Next(18, 100);
			int iGender = new Random().NextDouble() < 0.5d ? 2 : 3; // 2 - Male, 3 - Female
			
			var respUpdateAge = wc.UploadString(string.Format(_BaseURL + "/UpdateFeature?SessionID={0}&name=Age&value={1}", strSessionID, iAge), "");
			var respUpdateGender = wc.UploadString(string.Format(_BaseURL + "/UpdateFeature?SessionID={0}&name=Gender&value={1}", strSessionID, iGender), "");
			
			// moderate cough
			var respUpdateCough = wc.UploadString(string.Format(_BaseURL + "/UpdateFeature?SessionID={0}&name=SeverityCough&value={1}", strSessionID, "4"), "");
			
			// elevated temperature
			var respUpdateTemp = wc.UploadString(string.Format(_BaseURL + "/UpdateFeature?SessionID={0}&name=Temp&value={1}", strSessionID, "103.4"), "");


			// Analyze()
			var respAnalyze = wc.DownloadString(string.Format(_BaseURL + "/Analyze?SessionID={0}", strSessionID) );
			var jAnalyzeObject = JObject.Parse(respAnalyze);
			
			var jarrDiseases = jAnalyzeObject.GetValue("Diseases") as JArray;
			
			for (int i = 0; i < jarrDiseases.Count; i++)
			{
				var diseaseItem = jarrDiseases[i];
				var sadf = diseaseItem.Children().First();
				var diseaseName = (diseaseItem.Children().First() as JProperty).Name;
				var diseaseProbability = (diseaseItem.Children().First() as JProperty).Value;
				
				Console.WriteLine("Disease " + diseaseName + " with probability " + diseaseProbability);
			}
			
		}
		
	}
}
