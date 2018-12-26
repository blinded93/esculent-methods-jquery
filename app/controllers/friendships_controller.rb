class FriendshipsController < ApplicationController
  before_action :error_if_not_logged_in, only [:create, :destroy]
  def index
    friendships = current_user.friendships

    render json: friendships,
           status: 200
  end
end
