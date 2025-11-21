from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from .serializers import BirthDetailsSerializer
from consultation import utlis as consultation_utils

class KundliGenerateView(APIView):
    def post(self, request):
        serializer = BirthDetailsSerializer(data=request.data)
        if not serializer.is_valid():
            return Response({"errors": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

        data = serializer.validated_data
        result = consultation_utils.get_kundli_data(
            data["year"], data["month"], data["day"],
            data["hour"], data["minute"], data["lat"], data["lon"], data["tzone"]
        )

        if result is None:
            return Response({"error": "Failed to fetch kundli data. Check API key or inputs."}, status=status.HTTP_502_BAD_GATEWAY)

        return Response(result, status=status.HTTP_200_OK)