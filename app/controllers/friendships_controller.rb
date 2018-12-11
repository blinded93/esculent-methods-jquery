class FriendshipsController < ApplicationController
  def index
    friendships = current_user.friendships

    render json: friendships,
           status: 200
  end
end
