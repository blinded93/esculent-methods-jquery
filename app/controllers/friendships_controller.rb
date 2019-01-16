class FriendshipsController < ApplicationController
  before_action :error_if_not_logged_in, only: [:create, :destroy]
  def index
    friendships = current_user.friendships

    render json: friendships,
           status: 200
  end

  def create
    friendship = FriendshipService.create(params)

    render json: friendship,
           status: 200

  end

  def destroy
    binding.pry
    friendship = Friendship.find_by({user_id: params[:user_id],
                                   friend_id: params[:friend_id]}).destroy
    render json: friendship,
           status: 200

  end
end
