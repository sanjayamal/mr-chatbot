from flask import Flask, request, jsonify, Blueprint, current_app
from services.auth_service import AuthService
from repositories.auth_repository import AuthRepository
from flask_cors import cross_origin

auth_bp = Blueprint('auth_bp',__name__)
auth_repository = AuthRepository()
auth_service = AuthService()


@auth_bp.route('/api/v1/user-create', methods=['POST'])
def create_user():
    print('user create')


@auth_bp.route('/api/v1/login', methods=['POST'])
def login():
    print('user login')
